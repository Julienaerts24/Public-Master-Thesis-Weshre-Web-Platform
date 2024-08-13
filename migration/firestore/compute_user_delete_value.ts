import * as fs from 'fs';

const { convertFirebaseDocumentIdToSupabaseUUID } = require('./utils');

const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('Usage: node script.ts <path_to_auth_export_json> <path_to_firestore_users_json>');
    process.exit(1);
}

const authExportPath = args[0];
const firestoreUsersPath = args[1];

main(authExportPath, firestoreUsersPath);

async function main(authExportPath: string, firestoreUsersPath: string) {
    const validUids = getValidUids(authExportPath);
    await markDeletedUsers(firestoreUsersPath, validUids);
    console.log('Done processing.');
}

function getValidUids(authExportPath: string): Set<string> {
    const authData = JSON.parse(fs.readFileSync(authExportPath, 'utf8'));
    const uids = new Set<string>();

    authData.forEach((user: any) => {
        if (user.localId) {
            if(user.localId == "059cdxkOeETu1QaxynfNM3rdv8Y2"){
                console.log(convertFirebaseDocumentIdToSupabaseUUID(user.localId))
            }
            uids.add(convertFirebaseDocumentIdToSupabaseUUID(user.localId));
        }
    });

    return uids;
}

async function markDeletedUsers(firestoreUsersPath: string, validUids: Set<string>) {
    console.log(validUids.size)
    const usersData = JSON.parse(fs.readFileSync(firestoreUsersPath, 'utf8'));
    const updatedUsers = usersData.map((user: any) => {
        if (!validUids.has(user.uid)) {
            user.deleted = true;
        }
        return user;
    });

    const tempFilePath = firestoreUsersPath + '.tmp';
    fs.writeFileSync(tempFilePath, JSON.stringify(updatedUsers, null, 2));

    fs.renameSync(tempFilePath, firestoreUsersPath);
    console.log(`Updated users written to ${firestoreUsersPath}`);
}