import * as fs from 'fs';
import { Client, QueryResult } from 'pg';
import { chain } from 'stream-chain';
import { withParser } from 'stream-json/streamers/StreamArray';

const crypto = require('crypto');
const args = process.argv.slice(2);
let filename: string;
let client: Client;

if (args.length < 1) {
    console.log('Usage: ts-node import_users.ts <path_to_json_file> [<batch_size>] [<limit>]');
    console.log('  path_to_json_file: full local path and filename of .json input file (of users)');
    console.log('  batch_size: number of users to process in a batch (defaults to 100)');
    console.log('  limit: maximum number of users to process (optional)');
    process.exit(1);
} else {
    filename = args[0];
}
const BATCH_SIZE = parseInt(args[1], 10) || 100;
const LIMIT = args[2] ? parseInt(args[2], 10) : undefined;

if (!BATCH_SIZE || typeof BATCH_SIZE !== 'number' || BATCH_SIZE < 1) {
    console.log('invalid batch_size');
    process.exit(1);
}

interface PgCreds {
    users: {
        private: string;
        public: string;
    };
    password: {
        private: string;
        public: string;
    };
    host: string;
    port: number;
    database: string;
}

let pgCreds: PgCreds;
try {
    pgCreds = JSON.parse(fs.readFileSync('./supabase-service.json', 'utf8')) as PgCreds;
    if (typeof pgCreds.users !== 'object' ||
        typeof pgCreds.users.private !== 'string' ||
        typeof pgCreds.users.public !== 'string' ||
        typeof pgCreds.password !== 'object' ||
        typeof pgCreds.password.private !== 'string' ||
        typeof pgCreds.password.public !== 'string' ||
        typeof pgCreds.host !== 'string' ||
        typeof pgCreds.port !== 'number' ||
        typeof pgCreds.database !== 'string') {
        throw new Error('Invalid pgCreds format');
    }
} catch (err: unknown) {
    console.log('\n error reading supabase-service.json', err);
    process.exit(1);
}

const privateDatabases = false;
const selectedUser = privateDatabases ? pgCreds.users.private : pgCreds.users.public;
const selectedPassword = privateDatabases ? pgCreds.password.private : pgCreds.password.public;

async function main(filename: string) {
    client = new Client({
        user: selectedUser,
        host: pgCreds.host,
        database: pgCreds.database,
        password: selectedPassword,
        port: pgCreds.port
    });
    await client.connect();

    console.log(`loading users from ${filename}`);
    await loadUsers(filename);
    console.log(`done processing ${filename}`);
    quit();
}

function quit() {
    client.end();
    process.exit(1);
}

async function loadUsers(filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const Batch = require('stream-json/utils/Batch');
        let insertRows: string[] = [];
        let count = 0;

        const pipeline = chain([
            fs.createReadStream(filename),
            withParser(),
            new Batch({ batchSize: BATCH_SIZE })
        ]);

        pipeline.on('data', async (data: any) => {
            if (LIMIT && count >= LIMIT) {
                pipeline.end();
                return;
            }

            for (const item of data) {
                if (LIMIT && count >= LIMIT) break;
                const user = item.value;
                if (user.localId === 'aXae0i0B29eti63fRdmFfM8jAAw2') {
                    continue; // Skip this user because it it the one by default in the database before the migration
                }
                insertRows.push(createUser(user));
                count++;
            }

            console.log('insertUsers:', insertRows.length);
            pipeline.pause();
            const result = await insertUsers(insertRows);
            insertRows = [];
            pipeline.resume();
        });

        pipeline.on('end', () => {
            console.log('finished');
            resolve('');
        });

        pipeline.on('error', (err: Error) => {
            console.log('loadUsers error', err);
            quit();
        });
    });
}

async function insertUsers(rows: string[]): Promise<void> {
    const sql = createUserHeader() + rows.join(',\n') + ` ON CONFLICT (id) DO UPDATE SET
        email = CASE WHEN EXCLUDED.email IS NOT NULL AND EXCLUDED.email != '' THEN EXCLUDED.email ELSE auth.users.email END,
        raw_app_meta_data = COALESCE(EXCLUDED.raw_app_meta_data, auth.users.raw_app_meta_data),
        raw_user_meta_data = COALESCE(EXCLUDED.raw_user_meta_data, auth.users.raw_user_meta_data),
        phone = CASE WHEN EXCLUDED.phone IS NOT NULL AND EXCLUDED.phone != '' THEN EXCLUDED.phone ELSE auth.users.phone END;`;
    try {
        await runSQL(sql);
        console.log('SQL execution successful');
    } catch (err) {
        console.error('SQL execution error:', err);  // Log any errors
    }
}

async function runSQL(sql: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        client.query(sql, (err: Error, res: QueryResult<any>) => {
            if (err) {
                console.log('runSQL error:', err);
                console.log('sql was: ');
                console.log(sql);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function createUserHeader(): string {
    return `INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change_token_current,
        email_change_confirm_status
    ) VALUES `;
}

function createUser(user: any): string {
    if (!user.providerUserInfo) {
        user.providerUserInfo = [];
    }

    const uuid = convertFirebaseDocumentIdToSupabaseUUID(user.localId);
    
    const email = (user.providerUserInfo[0] && user.providerUserInfo[0].email) ? user.providerUserInfo[0].email : user.email ? user.email : null;
    const emailField = email !== null ? `'${email.replace(/'/g, "''")}'` : 'NULL';

    const phone = user.phoneNumber ? `'${user.phoneNumber}'` : 'NULL';
    if (user.phoneNumber){ user.providerUserInfo.push({"providerId": "phone"})}

    const raw_app_meta_data = ((user.providerUserInfo && user.providerUserInfo.length > 0) || (user.email && user.passwordHash && user.salt)) ? getProviderString(user.providerUserInfo) : JSON.stringify({});
    
    const rawUserMetaData: any = {
        ...(user.providerUserInfo && user.providerUserInfo.length > 0 && user.providerUserInfo[0].rawId && { provider_id: user.providerUserInfo[0].rawId }),
        ...(user.passwordHash && { fb_pw_hash: user.passwordHash }),
        ...(user.salt && { fb_pw_salt: user.salt }),
        fbuser: user,
    };
    
    const raw_user_meta_data = JSON.stringify(rawUserMetaData).replace(/'/g, "''");

    const sql = `(
        '00000000-0000-0000-0000-000000000000', /* instance_id */
        '${uuid}', /* id */
        'authenticated', /* aud character varying(255),*/
        'authenticated', /* role character varying(255),*/
        ${emailField}, /* email character varying(255),*/
        NULL, /* encrypted_password character varying(255),*/
        NULL, /* email_confirmed_at timestamp with time zone,*/
        NULL, /* invited_at timestamp with time zone, */
        '', /* confirmation_token character varying(255), */
        NULL, /* confirmation_sent_at timestamp with time zone, */
        '', /* recovery_token character varying(255), */
        NULL, /* recovery_sent_at timestamp with time zone, */
        '', /* email_change_token_new character varying(255), */
        '', /* email_change character varying(255), */
        NULL, /* email_change_sent_at timestamp with time zone, */
        NULL, /* last_sign_in_at timestamp with time zone, */
        '${raw_app_meta_data}', /* raw_app_meta_data jsonb,*/
        '${raw_user_meta_data}', /* raw_user_meta_data jsonb,*/
        NULL, /* is_super_admin boolean, */
        NOW(), /* created_at timestamp with time zone, */
        NOW(), /* updated_at timestamp with time zone, */
        ${phone}, /* phone character varying(15) DEFAULT NULL::character varying, */
        NULL, /* phone_confirmed_at timestamp with time zone, */
        '', /* phone_change character varying(15) DEFAULT ''::character varying, */
        '', /* phone_change_token character varying(255) DEFAULT ''::character varying, */
        NULL, /* phone_change_sent_at timestamp with time zone, */
        '', /* email_change_token_current character varying(255) DEFAULT ''::character varying, */
        0 /* email_change_confirm_status smallint DEFAULT 0 */
    )`;
    return sql;
}

function getProviderString(providerData: any[]): string {
    const providers = providerData.map(p => {
        const providerId = p.providerId.toLowerCase().replace('.com', '');
        switch (providerId) {
            case 'password':
                return 'email';
            case 'apple':
                return 'apple';
            case 'google':
                return 'google';
            case 'facebook':
                return 'facebook';
            case 'phone':
                return 'phone';
            default:
                return providerId;
        }
    });
    if (providers.length == 0){ return `{"provider": "email","providers":["email"]}`;}
    const primaryProvider = providers[0] || 'email';
    return `{"provider": "${primaryProvider}","providers":["${providers.join('","')}"]}`;
}

// Function to convert a 20 character long document ID to a 32 hexadecimal string
function convertFirebaseDocumentIdToSupabaseUUID(firebaseId: string): string {
    const hash = crypto.createHash('sha256').update(firebaseId).digest('hex');
    const uuidStr = hash.slice(0, 32);
    const formattedUuid = [
        uuidStr.slice(0, 8),
        uuidStr.slice(8, 12),
        uuidStr.slice(12, 16),
        uuidStr.slice(16, 20),
        uuidStr.slice(20, 32)
    ].join('-');

    return formattedUuid;
}

main(filename);
