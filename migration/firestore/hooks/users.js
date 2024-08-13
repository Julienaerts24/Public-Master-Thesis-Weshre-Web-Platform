const { convertFirebaseTimeStampToDate, convertFirebaseDocumentIdToSupabaseUUID, convertLanguagesArray } = require('../utils');

module.exports = (collectionName, doc, recordCounters, writeRecord) => {
    const newsId = doc.firestore_id || doc.firestoreid || doc.original_id || doc.originalid;
    const newsDoc = {
        uid: convertFirebaseDocumentIdToSupabaseUUID(newsId),
        display_name: doc.displayName ? doc.displayName : null,
        email: doc.email ? doc.email : null,
        first_name: doc.firstName ? doc.firstName : null,
        last_name: doc.lastName ? doc.lastName : null,
        profile_image: (doc.photoURL || doc.photo) ? (doc.photoURL || doc.photo) : null,
        birthdate: doc.birthdate ? convertFirebaseTimeStampToDate(doc.birthdate) : null,
        gender: doc.gender ? doc.gender : null,
        ratings: doc.ratings ? doc.ratings : 0,
        about: doc.description ? doc.description : null,
        city: doc.city ? doc.city : null,
        hobbies: doc.hobbies ? doc.hobbies : null,
        job: doc.job ? doc.job : null,
        languages: doc.languages ? convertLanguagesArray(doc.languages) : null,
        phoneNumber: (doc.phoneNumber || doc.phone) ? (doc.phoneNumber || doc.phone) : null,
        school: doc.school ? doc.school : null,
        stripe_customer_id: doc.customerId ? doc.customerId : null,
        stripe_connect_account_object: doc.stripeUser ? doc.stripeUser : null,
        stripe_connected_account: (doc.stripeUser && doc.stripeUser.id) ? doc.stripeUser.id : null,
        deleted: false
    };
    writeRecord('_users', newsDoc, recordCounters);
    return undefined;
};