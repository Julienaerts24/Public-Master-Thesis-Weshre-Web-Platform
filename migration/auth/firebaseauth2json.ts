import * as fs from 'fs';
import { exec } from 'child_process';

// Read arguments
const args = process.argv.slice(2);

if (args.length < 1) {
    console.log('Usage: ts-node processUsersWithHashes.ts <project-id> [<output_filename.json>] [<limit>]');
    console.log('   <project-id>: Firebase project ID');
    console.log('   <output_filename.json>: (optional) output filename (defaults to ./users.json)');
    console.log('   <limit>: (optional) maximum number of valid users to fetch (no limit by default)');
    process.exit(1);
} else {
    main();
}

async function main() {
    const projectId = args[0];
    const outputFilename = args[1] || "./users.json";
    const limitInput = args[2];
    const limit = limitInput ? parseInt(limitInput, 10) : undefined;
    const tempFilename = 'users_with_hashes.json';

    try {
        // Export users with hashes using Firebase CLI
        await exportUsersWithHashes(projectId, tempFilename);

        // Read the exported JSON file
        const data = fs.readFileSync(tempFilename, 'utf-8');
        let usersData = JSON.parse(data);

        // Filter users based on providerUserInfo, email, and passwordHash: NOT USED ANYMORE
        /*
        let validUsers = usersData.users.filter((user: any) => {
            return !(user.providerUserInfo && user.providerUserInfo.length > 0 && user.providerUserInfo[0].providerId && user.providerUserInfo[0].rawId && user.providerUserInfo[0].email) && 
            !(user.email && user.passwordHash && user.salt) &&
            !user.phoneNumber &&
            !(user.email && user.email.includes("@privaterelay.appleid.com"));
        });
        */

        if (limit) {
            usersData = usersData.slice(0, limit); // Apply limit to the number of valid users
        }

        // Write the processed valid user data to the output file
        fs.writeFileSync(outputFilename, JSON.stringify(usersData, null, 2), 'utf-8');
        console.log(`Successfully processed and saved ${usersData.length} valid users to ${outputFilename}`);

        // Clean up the temporary file
        fs.unlinkSync(tempFilename);
    } catch (err) {
        console.error('Error during the process:', err);
    }
}

function exportUsersWithHashes(projectId: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const command = `firebase auth:export ${filename} --format=json --project ${projectId}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${stderr}`);
                reject(error);
                console.log("If you have not yet login to firebase, you need to execute the 'firebase login' command on any terminal.")
                return;
            }
            console.log(`Export successful: ${stdout}`);
            resolve();
        });
    });
}