import { collection, query, doc, where, getDocs, getDoc, DocumentData, addDoc, setDoc, deleteDoc, updateDoc} from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { partialEventType } from "@/type/eventType"
import { convertEventToFormType } from "@/utils/convertEventType";
import { formValuesType } from '@/type/formType';
import { formatDate } from '@/utils/formattedDate';

export type EventDataType = {
  id: string;
  title: string;
  description: string;
  date_begin: Date;
  date_end: Date;
  availableTickets: number;
  priceNormalTicket: number;
  image: string;
  image_dark: string;
  currency: string;
  draft: boolean;
};

export type TicketDataType = {
  id: string;
  amount: number;
};

export type UserInfo = {
  uid: string;
  name: string;
  photo: string;
  data?: string;
};

interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  photoURL: string;
}

export async function getEvent(eventId: string): Promise<EventDataType | null> {
  try {
    const eventsCollection = collection(db, "ws_events");
    const eventDocRef = doc(eventsCollection, eventId);
    const eventDoc = await getDoc(eventDocRef);
    if (eventDoc.exists()) {
      const eventData = eventDoc.data();
      return {
        id: eventDoc.id,
        title: eventData.information.title, 
        description: eventData.information.description, 
        date_begin: eventData.information.date.from.toDate(),
        date_end: eventData.information.date.to.toDate(),
        image: eventData.photos.cover.uri,
        availableTickets: eventData.tickets !== undefined ? eventData.tickets : 0, // TODO Put to 0 if not define is ok?
        priceNormalTicket: parseFloat(eventData.price.price),
        currency: eventData.price.currency.symbole
      } as EventDataType;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching events: ", error);
    return null;
  }
}

enum EventCreatorStatus {
  NoDocument = "noDoc",
  IsCreator = "isCreator",
  IsNotCreator = "isNotCreator",
  ErrorFetching = "errorFetching"
}

export async function isEventCreator(eventId: string, userId: string): Promise<EventCreatorStatus> {
  try {
    const eventDocRef = doc(db, "ws_events", eventId);
    const eventDoc = await getDoc(eventDocRef);

    if (!eventDoc.exists()) {
      return EventCreatorStatus.NoDocument;
    }

    const event = eventDoc.data();
    if (event.userRef.id === userId) {
      return EventCreatorStatus.IsCreator;
    } else {
      return EventCreatorStatus.IsNotCreator;
    }
  } catch (error) {
    return EventCreatorStatus.ErrorFetching;
  }
}

export async function getFormDataFromEvent(eventId: string): Promise<formValuesType> {
  try {
    const eventsCollection = collection(db, "ws_events");
    const eventDocRef = doc(eventsCollection, eventId);
    const eventDoc = await getDoc(eventDocRef);
    if (eventDoc.exists()) {
      const eventData = eventDoc.data();
      const formData = await convertEventToFormType(eventData as partialEventType)
      return formData
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error fetching events: ", error);
    return {};
  }
}

export async function getEventsUser(uid: string): Promise<EventDataType[]> {
  try {
    const userRef = doc(db, "users", uid);
    const eventsCollection = collection(db, "ws_events");
    const allEventsQuery = query(eventsCollection, where("userRef", "==", userRef));

    // Filter the event by removing all the events that are deleted but not a draft (since the draft is not show on the app => Draft act as deleted on the app)
    const snapshot = await getDocs(allEventsQuery);
    const filteredEvents = snapshot.docs.filter((doc) => {
      const data = doc.data();
      return !data.deleted || (data.deleted && data.draft?.draft);
    }).map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: (data.information !== undefined && data.information.title !== undefined) ? data.information.title : "",
        description: (data.information !== undefined && data.information.description !== undefined) ? data.information.description : "",
        date_begin: (data.information !== undefined && data.information.date !== undefined && data.information.date.from !== undefined) ? data.information.date.from.toDate() : (data.draft !== undefined && data.draft.last_modification !== undefined) ? data.draft.last_modification.toDate() : "",
        date_end: (data.information !== undefined && data.information.date !== undefined && data.information.date.to !== undefined) ? data.information.date.to.toDate() : (data.draft !== undefined && data.draft.last_modification !== undefined) ? data.draft.last_modification.toDate() : "",
        image: (data.photos !== undefined && data.photos.cover !== undefined && data.photos.cover.uri !== undefined) ? data.photos.cover.uri : "/images/no_images.jpg",
        image_dark: (data.photos !== undefined && data.photos.cover !== undefined && data.photos.cover.uri !== undefined) ? data.photos.cover.uri : "/images/no_images_dark.jpg" ,
        draft: data.draft !== undefined && data.draft.draft === true
      } as EventDataType;
    });

    return filteredEvents;

  } catch (error) {
    console.error("Error fetching events: ", error);
    return [];
  }
}

export async function deleteAllDraft(userId: string){
  try {
    const userRef = doc(db, "users", userId);
    const eventsCollection = collection(db, "ws_events");
    const allEventsQuery = query(eventsCollection, where("userRef", "==", userRef));
    const querySnapshot = await getDocs(allEventsQuery);
    // Iterating over each document and deleting it
    querySnapshot.forEach(async (document) => {
      const data = document.data();
      if(data.draft !== undefined && data.draft.draft === true){
        const docRef = doc(db, "ws_events", document.id);
        await deleteDoc(docRef);
      }
    });
  } catch (error) {
      console.error("Error deleting draft: ", error);
    }
}

export async function deleteEvent(eventId: string) {
  try {
    const eventDocRef = doc(db, "ws_events", eventId);
    const eventDoc = await getDoc(eventDocRef);

    if (!eventDoc.exists()) {
      throw new Error("Event does not exist!");
    }

    const updatedEvent = {
      ...eventDoc.data(),
      deleted: true,
      draft: {
        draft: false,
        last_modification: new Date()
      }
    };

    await updateDoc(eventDocRef, updatedEvent);
  } catch (error) {
    console.error("Error updating event: ", error);
    throw error;
  }
}


export async function getTicketsEvent(eventId: string): Promise<TicketDataType[]> {
  try {
    const eventRef = doc(db, "ws_events", eventId);
    const ticketsCollection = collection(db, "tickets");
    const ticketsSnapshot = await getDocs(ticketsCollection);
    const listTickets: DocumentData[] = [];
    ticketsSnapshot.forEach((docSnapshot) => {
      const ticketData = docSnapshot.data();
      if (ticketData.event?._ref && ticketData.event._ref.path === eventRef.path && ticketData.status == "ACCEPTED") {
        listTickets.push(ticketData);
      }
    });

    const ticketDatas = listTickets.map((ticketData) => {
      return {
        id: ticketData.id,
        amount: parseFloat(ticketData.amount),
      } as TicketDataType;
    });
    return ticketDatas;

  } catch (error) {
    console.error("Error fetching tickets: ", error);
    return [];
  }
}

export async function getUsersEvent(eventId: string): Promise<UserInfo[]> {
  try {
    const eventRef = doc(db, "ws_events", eventId);
    const ticketsCollection = collection(db, "tickets");
    const ticketsSnapshot = await getDocs(ticketsCollection);
    const listTickets: DocumentData[] = [];
    ticketsSnapshot.forEach((docSnapshot) => {
      const ticketData = docSnapshot.data();
      if (ticketData.event?._ref && ticketData.event._ref.path === eventRef.path && ticketData.status == "ACCEPTED") {
        listTickets.push(ticketData);
      }
    });

    // Sort tickets by date in descending order (most recent first)
    listTickets.sort((a, b) => b.date.toDate() - a.date.toDate());

    const userPromises = listTickets.map(async (ticketData) => {
      try {
        const userRef = ticketData.userRef;
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as UserData;
          return {
            uid: userData.uid,
            name: userData?.firstName + ' ' + userData?.lastName,
            photo: userData?.photoURL,
            data: formatDate(ticketData.date.toDate()),
          } as UserInfo;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    });
    const usersData = await Promise.all(userPromises);
    return usersData.filter((user): user is UserInfo => user !== null);

  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}

export async function saveEvent(docData: Partial<partialEventType>, eventId: string | undefined): Promise<string> {
  try {
    if (eventId === undefined){
      const docRef1 = await addDoc(collection(db, "ws_events"), docData);
      return docRef1.id;
    }
    else {
      await setDoc(doc(db, "ws_events", eventId!), docData, { merge: false });
      return eventId;
    }
  } catch (error) {
      console.error("Error saving dashboard layout with user reference:", error);
      throw error;
  }
}