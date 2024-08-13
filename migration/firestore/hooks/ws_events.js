module.exports = (collectionName, doc, recordCounters, writeRecord) => {
    // Check if the document has the 'information' field and it has a 'title'
    if (doc.information && doc.information.title) {
      // Create a new document containing only the title
      const titleDoc = {
        id: doc.firestore_id || doc.firestoreid || doc.original_id || doc.originalid,
        title: doc.information.title
      }
      // Use the utils function, to write the data into a JSON file named '_ws_events
      writeRecord('_ws_events', titleDoc, recordCounters);
    }
    return {};
  };