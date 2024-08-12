import { collection, query, doc, where, getDocs, getDoc, DocumentData, DocumentReference} from "firebase/firestore";
import { db } from "@/firebase/config.js";

export type GroupDataType = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export async function getGroupsUser(uid: string): Promise<GroupDataType[]> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) { // check user exist
      return [];
    }

    const userData = userSnap.data();
    if (!userData.groups || userData.groups.length === 0) { // check user.groups exist and is not empty
      return [];
    }

    const groupDataPromises = userData.groups.map(async (groupRef: DocumentReference) => { // retreive the information about each group the user is member of.
      const groupSnap = await getDoc(groupRef);
      if (!groupSnap.exists()) {
        return null;
      }
      const groupData = groupSnap.data();
      return {
        id: groupSnap.id,
        name: groupData.name,
        description: groupData.description,
        image: groupData.photo,
      };
    });

    // Filter out any null results (for groups that might not exist)
    const groupsData = (await Promise.all(groupDataPromises)).filter(Boolean);

    return groupsData;
  } catch (error) {
    console.error("Error fetching user groups: ", error);
    return [];
  }
}
