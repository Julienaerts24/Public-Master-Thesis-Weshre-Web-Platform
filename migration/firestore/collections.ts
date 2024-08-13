import { getFirestoreInstance } from './utils';
import { CollectionReference, Firestore, DocumentData } from 'firebase-admin/firestore';

const db: Firestore = getFirestoreInstance();

async function main() {
    try {
        const collections: CollectionReference<DocumentData>[] = await db.listCollections();
        collections.forEach(collection => {
            console.log(collection.id);
        });
    } catch (err) {
        console.log('ERROR', err);
    }
}

main();
