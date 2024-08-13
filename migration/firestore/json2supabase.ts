import * as fs from 'fs';
import { Client } from 'pg';
import { withParser } from 'stream-json/streamers/StreamArray';
import { Readable } from 'stream';
import { isValidISOString } from './utils';

const args = process.argv.slice(2);
let filename: string;
let tableName: string;
let fields: { [key: string]: string };
let client: Client;
let totalInserted = 0;

if (args.length < 1) {
    console.log('Usage: ts-node json2supabase.ts <path_to_json_file> [<primary_key_strategy>] [<primary_key_name>]');
    console.log('  path_to_json_file: full local path and filename of .json input file where filename == name of table you want to create/modify');
    console.log('  primary_key_strategy (optional):');
    console.log('    none (no primary key is added');
    console.log('    serial (id SERIAL PRIMARY KEY) (autoincrementing 2-byte integer)');
    console.log('    smallserial (id SMALLSERIAL PRIMARY KEY) (autoincrementing 4-byte integer)');
    console.log('    bigserial (id BIGSERIAL PRIMARY KEY) (autoincrementing 8-byte integer)');
    console.log('    uuid (id UUID PRIMARY KEY DEFAULT uuid_generate_v4()) (randomly generated uuid)');
    console.log('    firestore_id (id TEXT PRIMARY KEY) (uses existing firestore_id random text as key)');
    console.log('  primary_key_name (optional): name of primary key (defaults to "id")');
    process.exit(1);
} else {
    filename = args[0];
}
const primary_key_strategy = args[1] || 'none';
const primary_key_name = args[2] || 'id';

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
    console.log(`\n Analyzing fields...\n`);
    fields = await getFields(filename);

    client = new Client({
        user: selectedUser,
        host: pgCreds.host,
        database: pgCreds.database,
        password: selectedPassword,
        port: pgCreds.port
    });
    tableName = filename.replace(/\\/g, '/').split('/').pop()!.split('.')[0].replace('.json', '').replace(/^_/, '');
    console.log(`\n Verifying schema table...\n`);
    await VerificationSchemaTable(tableName, fields);
    console.log(`\n Loading data...\n`);
    await loadData();
    console.log(`\n Done processing ! ${totalInserted} row add or updated in the table !\n`);
    quit();
}

function quit() {
    client.end();
    process.exit(1);
}

async function getFields(filename: string): Promise<{ [key: string]: string }> {
    // Reads the JSON file to determine the fields and their types:
    return new Promise((resolve, reject) => {
        const jsonStream = withParser();
        const fields: { [key: string]: string } = {};
        const readStream = fs.createReadStream(filename).pipe(jsonStream);

        jsonStream.on('data', ({ key, value }: { key: number, value: any }) => {
            for (const attr in value) {
                if (value[attr] === null) {
                    continue; // Skip null values
                }

                if (!fields[attr]) {
                    fields[attr] = typeof value[attr];
                } else if (fields[attr] !== typeof value[attr] && value[attr] !== null) {
                    console.log(`multiple field types found for field ${attr}: ${fields[attr]}, ${typeof value[attr]}`);
                    fields[attr] = 'object';
                }
            }
        });

        jsonStream.on('end', () => {
            for (const attr in fields) {
                fields[attr] = jsToSqlType(fields[attr]);
            }
            (readStream as Readable).destroy();
            resolve(fields);
        });

        jsonStream.on('error', (err: Error) => {
            reject(err);
        });
    });
}

async function VerificationSchemaTable(tableName: string, fields: { [key: string]: string }) {
    // Verify that all the field of the JSON and the table match in name and type:
    return new Promise<void>((resolve, reject) => {
        client.connect();
        client.query(`SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
        FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema = 'public' and table_name = '${tableName}'`, (err: Error, res: any) => {
            if (err) {
                quit();
                reject(err);
            } else {
                if (res.rows.length > 0) {
                    for (const attr in fields) {
                        const dataType = res.rows.find((row: { column_name: string; data_type: string }) => row.column_name === attr)?.data_type;
                        if (!dataType) {
                            console.log(`\n field not found in ${tableName} table: ${attr}\n `);
                            quit();
                            reject(`field not found in ${tableName} table: ${attr}`);
                        }
                        if (attr === primary_key_name ? getKeyType(primary_key_strategy) === SqlToJsType(dataType) : SqlToJsType(dataType) !== fields[attr]) {
                            console.log(`\n data type mismatch for field ${attr}: ${dataType}, ${fields[attr]}\n `);
                            quit();
                            reject(`data type mismatch for field ${attr}: ${dataType}, ${fields[attr]}`);
                        }
                    }
                    resolve();
                } 
                else {
                    console.log(`\n Table ${tableName} does not exist.\n`);
                    quit();
                    reject(`\n Table ${tableName} does not exist.\n`);
                }
            }
        });
    });
}

async function loadData() {
    return new Promise<void>((resolve, reject) => {
        let insertRows: string[] = [];
        const jsonStream = withParser();
        const readStream = fs.createReadStream(filename).pipe(jsonStream);
        let batchNumber = 0;

        jsonStream.on('data', async ({ key, value }: { key: number, value: any }) => {
            let sql = `(`;

            for (const attr in fields) {
                let val = value[attr];

                if (val === null || typeof val === 'undefined') {
                    sql += `${sql.length > 1 ? ',' : ''}null`;
                } else if (Array.isArray(val)) {
                    val = `{${val.map(v => `"${v.replace(/"/g, '\\"')}"`).join(',')}}`;
                    sql += `${sql.length > 1 ? ',' : ''}'${val.replace(/'/g, "''")}'`;
                } else if (typeof val === 'object') {
                    val = JSON.stringify(val);
                    sql += `${sql.length > 1 ? ',' : ''}'${val.replace(/'/g, "''")}'`;
                } else if (fields[attr] !== 'numeric' && fields[attr] !== 'boolean') {
                    sql += `${sql.length > 1 ? ',' : ''}'${val.replace(/'/g, "''")}'`;
                } else {
                    sql += `${sql.length > 1 ? ',' : ''}${val}`;
                }
            }
            if (primary_key_strategy === 'firestore_id') {
                sql += `,'${value.firestore_id}'`;
            }
            sql += ')';
            insertRows.push(sql);
            if (insertRows.length >= 100) { // BATCH_SIZE
                const test = insertRows;
                insertRows = [];
                batchNumber++;
                console.log(`Insert batch number: ${batchNumber}`);
                await runSQL(makeInsertStatement(fields, test));
            }
        });

        jsonStream.on('error', (err: Error) => {
            console.log('\n loadData error', err);
            reject(err);
        });

        jsonStream.on('end', async () => {
            if (insertRows.length > 0) {
                batchNumber++;
                console.log(`Insert batch number: ${batchNumber}`);
                await runSQL(makeInsertStatement(fields, insertRows));
            }
            (readStream as Readable).destroy();
            resolve();
        });
    });
}


function makeInsertStatement(fields: { [key: string]: string }, insertRows: string[]): string {
    let fieldList = '';
    let updateList = '';
    for (const attr in fields) {
        fieldList += `${fieldList.length > 0 ? ',' : ''}"${attr}"`;
        updateList += `${updateList.length > 0 ? ',' : ''}"${attr}" = EXCLUDED."${attr}"`;
    }

    if (primary_key_strategy === 'firestore_id') {
        fieldList += `,${primary_key_name}`;
        updateList += `,${primary_key_name} = EXCLUDED.${primary_key_name}`;
    }

    // Use a composite key for ON CONFLICT clause if needed
    let conflictTarget = `"${primary_key_name}"`;
    if (tableName === 'group_members') {
        conflictTarget = `"group", "user"`;
    }

    let sql = `INSERT INTO "${tableName}" (${fieldList}) VALUES ${insertRows.join(',')}`;
    sql += ` ON CONFLICT (${conflictTarget}) DO UPDATE SET ${updateList}`;
    fs.writeFileSync('temp.sql', sql, 'utf8');
    return sql;
}

async function runSQL(sql: string) {
    return new Promise<void>((resolve, reject) => {
        client.query(sql, (err: Error, res: any) => {
            if (err) {
                console.log('\n runSQL error:', err);
                console.log('\n sql was: ' + sql);
                quit();
                reject(err);
            } else {
                totalInserted += res.rowCount || 0;
                resolve();
            }
        });
    });
}

function jsToSqlType(type: string): string {
    switch (type) {
        case 'string':
            return 'text';
        case 'number':
            return 'numeric';
        case 'boolean':
            return 'boolean';
        case 'object':
            return 'jsonb';
        case 'array':
            return 'jsonb';
        case 'ARRAY':
            return 'jsonb';
        default:
            return 'text';
    }
}

function SqlToJsType(type: string): string {
    switch (type) {
        case 'uuid':
            return 'text';
        case 'timestamp with time zone':
            return 'text';
        case 'date':
            return 'text';
        case 'ARRAY':
            return 'jsonb';
        case 'USER-DEFINED':
            return 'text';
        default:
            return type;
    }
}

function getKeyType(primary_key_strategy: string): string {
    switch (primary_key_strategy) {
        case 'none':
            return '';
        case 'serial':
            return 'integer';
        case 'smallserial':
            return 'smallint';
        case 'bigserial':
            return 'bigint';
        case 'uuid':
            return 'uuid';
        case 'firestore_id':
            return 'text';
        default:
            return '';
    }
}

main(filename);