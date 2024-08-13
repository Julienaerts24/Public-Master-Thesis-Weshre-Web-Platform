const { convertFirebaseDocumentIdToSupabaseUUID } = require('../utils');

module.exports = (collectionName, doc, recordCounters, writeRecord) => {
    if (doc.name && doc.photo && doc.description && doc.admin && doc.admin._path.segments[1] && doc.members) {
        // Add the group to the groups table
        const groupId = convertFirebaseDocumentIdToSupabaseUUID(doc.firestore_id || doc.firestoreid || doc.original_id || doc.originalid);
        const creatorId = convertFirebaseDocumentIdToSupabaseUUID(doc.admin._path.segments[1]);
        const groupsDoc = {
            uid: groupId,
            name: doc.name,
            photo: doc.photo,
            description: doc.description,
            creator: creatorId,
            members: doc.members.length
        };
        writeRecord('_groups', groupsDoc, recordCounters);
    
        // Add the creator of the group as an admin in the group_member table
        const groupMembersDoc = {
            group: groupId,
            user: creatorId,
            membership: "ADMIN",
            request_status: "ACCEPTED"
        };
        writeRecord('_group_members', groupMembersDoc, recordCounters);

        // Add all members of the group as a member in the group_member table
        doc.members.forEach(member => {
            const userId = convertFirebaseDocumentIdToSupabaseUUID(member._path.segments[1]);
            const groupMembersDoc = {
                group: groupId,
                user: userId,
                membership: "MEMBER",
                request_status: "ACCEPTED" 
            };
            writeRecord('_group_members', groupMembersDoc, recordCounters);
        });
        
        /* Bill say that was not needed
        // Add all the members request of the group as a member with a request_status == PENDING in the group_member table
        doc.membersRequest.forEach(member => {
            const userId = convertFirebaseDocumentIdToSupabaseUUID(member._path.segments[1]);
            const groupMembersDoc = {
                group: groupId,
                user: userId,
                membership: "MEMBER",
                request_status: "PENDING"
            };
            writeRecord('_group_members', groupMembersDoc, recordCounters);
        });
        */
    }

    return {};
};