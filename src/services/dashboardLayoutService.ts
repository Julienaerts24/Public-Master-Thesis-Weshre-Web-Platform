import { collection, query, doc, setDoc, addDoc, deleteDoc, where, getDocs} from "firebase/firestore";
import { db } from "@/firebase/config.js";

type breakpoints = 'xl' | 'lg' | 'sm' | 'phone';
type SavedLayoutItemType = {
  i: string,
  x: number,
  y: number,
  w: number,
  h: number,
  minW: number,
  maxW: number,
  minH: number,
  maxH: number,
}
type LayoutMap = Record<breakpoints, SavedLayoutItemType[]>;
export type DashboardsType = {id: string, name: string, layouts: LayoutMap}

export async function saveNewDashboardLayout(name: string, layout: LayoutMap, userId: string): Promise<string> {
  try {
      const userRef = doc(db, "users", userId);
      const docData = {
          name: name,
          layout: layout,
          userRef: userRef
      };

      const docRef = await addDoc(collection(db, "dashboards"), docData);
      return docRef.id;
  } catch (error) {
      console.error("Error saving dashboard layout with user reference:", error);
      throw error;
  }
}

export async function updateDashboardLayout(dashboardId: string, name: string, layout: LayoutMap) {
  try {
      const docData = {
          name: name,
          layout: layout,
      };
      await setDoc(doc(db, "dashboards", dashboardId), docData, { merge: true });
  } catch (error) {
      console.error("Error saving dashboard layout with user reference:", error);
  }
}

export async function deleteDashboard(dashboardId: string){
  try {
    const dashboardDocRef = doc(db, "dashboards", dashboardId);
    await deleteDoc(dashboardDocRef);
  } catch (error) {
      console.error("Error deleting dashboards: ", error);
      return [];
    }
}

export async function deleteAllDashboardUser(userId: string){
  try {
    const userRef = doc(db, "users", userId);
    const dashboardsCollection = collection(db, "dashboards");
    const q = query(dashboardsCollection, where("userRef", "==", userRef));
    const querySnapshot = await getDocs(q);
    // Iterating over each document and deleting it
    querySnapshot.forEach(async (document) => {
      const docRef = doc(db, "dashboards", document.id);
      await deleteDoc(docRef);
    });
  } catch (error) {
      console.error("Error deleting dashboards: ", error);
      return [];
    }
}

export async function getDashboardsUser(userId: string): Promise<DashboardsType[]> {
  try {
    const userRef = doc(db, "users", userId);
    const dashboardsCollection = collection(db, "dashboards");
    const q = query(dashboardsCollection, where("userRef", "==", userRef));
    const querySnapshot = await getDocs(q);
    const listDashboards: DashboardsType[] = [];
    querySnapshot.forEach((docSnapshot) => {
        const dashboardData = docSnapshot.data();
        const dashboard = {id: docSnapshot.id, name: dashboardData.name, layouts: dashboardData.layout}
        listDashboards.push(dashboard);
    });
    return listDashboards;
  } catch (error) {
      console.error("Error fetching dashboards: ", error);
      return [];
    }
}
