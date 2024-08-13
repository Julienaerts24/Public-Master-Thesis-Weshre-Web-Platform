const { convertFirebaseTimeStampToISODate, convertFirebaseDocumentIdToSupabaseUUID } = require('../utils');

module.exports = (collectionName, doc, recordCounters, writeRecord) => {
    if (doc.title && doc.description && doc.image && doc.active != null && doc.active != undefined && doc.date) {
        const newsId = doc.firestore_id || doc.firestoreid || doc.original_id || doc.originalid;

        let title = doc.title.en || doc.title.fr;
        if (!title) {
            // If neither 'en' nor 'fr' exists, take any available title
            const titleKeys = Object.keys(doc.title);
            if (titleKeys.length > 0) {
                title = doc.title[titleKeys[0]];
            }
        }

        let description = doc.description.en || doc.description.fr;
        if (!description) {
            // If neither 'en' nor 'fr' exists, take any available description
            const descriptionKeys = Object.keys(doc.description);
            if (descriptionKeys.length > 0) {
                description = doc.description[descriptionKeys[0]];
            }
        }
        
        if (!title) {title = ""}
        if (!description) {description = ""}

        const newsDoc = {
            id: convertFirebaseDocumentIdToSupabaseUUID(newsId),
            title: title,
            description: description,
            image: doc.image,
            active: doc.active,
            publishing_date: convertFirebaseTimeStampToISODate(doc.date),
            // end_date: null
        };
        writeRecord('_news', newsDoc, recordCounters);
    }
    else{
        console.log(doc)
    }
    return undefined;
};