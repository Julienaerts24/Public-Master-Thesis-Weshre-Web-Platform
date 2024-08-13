import { getFirestoreInstance, cleanUp, writeRecord } from './utils';
import * as fs from 'fs';
import { Firestore } from 'firebase-admin/firestore';
import * as path from 'path';

const args = process.argv.slice(2);

let processDocument: any;
const hookPath = path.join(__dirname, 'hooks', `${args[0]}.js`);
if (fs.existsSync(hookPath)) {
    processDocument = require(hookPath);
}

let db: Firestore;
const recordCounters: { [key: string]: number } = {};

if (args.length < 1) {
    console.log('Usage: firestore2json.ts <collectionName> [<batchSize>] [<limit>]');
    process.exit(1);
} else {
    db = getFirestoreInstance();
    main(args[0], args[1] || '1000', args[2] || '0');
}

async function main(collectionName: string, batchSize: string, limit: string) {
    await getAll(collectionName, 0, parseInt(batchSize), parseInt(limit));
}

async function getAll(collectionName: string, offset: number, batchSize: number, limit: number) {
    if (!processDocument) {
        console.log(`\n Corresponding hook not found, to convert a firebase collection to a JSON, you first need to define its corresponding hook file, see HOOKS.md in ./Firestore/hooks \n`);
        return;
    }

    const { data, error } = await getBatch(collectionName, offset, batchSize, limit);

    if (error) {
        console.error(`Error fetching batch at offset ${offset}:`, error);
        return;
    }

    if (data.length > 0) {
        console.log(`Fetched ${data.length} records at offset ${offset}`);
        await getAll(collectionName, offset + data.length, batchSize, limit);
    } else {
        cleanUp(recordCounters);
        for (let key in recordCounters) {
            if (key.startsWith('_')) {
                console.log(`${recordCounters[key]} records written to ${key}.json`);
            }
        }
    }
}

async function getBatch(collectionName: string, offset: number, batchSize: number, limit: number): Promise<{ data: any[], error: any }> {
    const data: any[] = [];
    let error: any = null;

    if (typeof recordCounters[collectionName] === 'undefined') {
        recordCounters[collectionName] = 0;
    }

    if (limit > 0 && recordCounters[collectionName] >= limit) {
        return { data, error };
    }

    if (limit > 0) {
        batchSize = Math.min(batchSize, limit - recordCounters[collectionName]);
    }

    await db.collection(collectionName)
        .limit(batchSize)
        .offset(offset)
        .get()
        .then(snapshot => {
            snapshot.forEach(fsdoc => {
                let doc = fsdoc.data();
                if (!doc.firestore_id) doc.firestore_id = fsdoc.id;
                if (!doc.firestoreid) doc.firestoreid = fsdoc.id;
                if (!doc.original_id) doc.original_id = fsdoc.id;
                if (!doc.originalid) doc.originalid = fsdoc.id;

                if (processDocument) {
                    doc = processDocument(collectionName, doc, recordCounters, writeRecord);
                }

                writeRecord(collectionName, doc, recordCounters);
                data.push(doc);
            });
        })
        .catch(err => {
            error = err;
        });

    return { data, error };
}