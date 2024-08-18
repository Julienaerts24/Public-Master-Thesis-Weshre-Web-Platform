import { collection, query, doc, where, getDocs, getDoc, DocumentData, QuerySnapshot} from "firebase/firestore";
import { db } from "@/firebase/config.js";
import { UserInfo } from "@/services/eventService";

export async function getEventsDocumentDataOfUser(userId: string): Promise<QuerySnapshot<DocumentData, DocumentData> | null> {
  try {
    const userRef = doc(db, "users", userId);
    const eventsCollection = collection(db, "ws_events");
    const q = query(eventsCollection, where("userRef", "==", userRef), where("deleted", "==", false));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  } catch (error) {
    console.error("Error fetching number events: ", error);
    return null;
  }
}

export type NationalityData = {
  label: string;
  value: number;
};

export type TicketDataType = {
  id: string;
  amount: number;
  date: Date;
};

type DataItem = {
  value: number;
  label: string;
};

export type DataYear = {
  year: number;
  datas: DataItem[];
};

export type dashboardDatas = {
  totalNumberTickets: number,
  totalNumberParticipants: number,
  ticketDatasAccepted: TicketDataType[],
  ticketDatasRefunded: TicketDataType[],
  nationalitiesData: NationalityData[],
  listUserInfo: UserInfo[] | undefined;
  dataYears: DataYear[];
}

export async function getDataDashboard(querySnapshot: QuerySnapshot<DocumentData, DocumentData>): Promise<dashboardDatas | null>{
  try {
    // Variable use for NumberParticipants:
    let numberTickets = 0; 

    // Variable use for TicketsDatas:
    const listTicketsAccepted: DocumentData[] = [];
    const listTicketsRefunded: DocumentData[] = [];

    // Variable use for NationalityCounts:
    const nationalityCounts: {[key: string]: number} = {};
    let total_nationalities = 0;

    // Variable use for ListUserInfo:
    const listUserInfo: UserInfo[] = [];
   
    const eventRefs = querySnapshot.docs.map(docSnapshot => doc(db, "ws_events", docSnapshot.id).path);  // Collect all event references in the querySnapshot
    const ticketsSnapshot = await getDocs(collection(db, "tickets"));
    const ticketPromises = ticketsSnapshot.docs.map(async (ticketDoc) => { 
      const ticketData = ticketDoc.data();
      if (eventRefs.includes(ticketData.event?._ref?.path)) { // For each ticket look if the reference correspond to one of the event references
        try {
          if (ticketData.status == "ACCEPTED") {
            // NumberParticipants:
            numberTickets += 1; 

            // TicketsDatas:
            listTicketsAccepted.push(ticketData);
            
            // NationalityCounts:
            const userSnapshot = await getDoc(ticketData.userRef);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data() as DocumentData;
              const country = userData.country || "Unknown";
              if (country != "Unknown"){
                total_nationalities++;
                if (nationalityCounts[country.key]){nationalityCounts[country.key]++} 
                else nationalityCounts[country.key] = 1;
              }
              // ListUserInfo
              const uid = userData.uid;
              const existingUserIndex = listUserInfo.findIndex(user => user.uid == "UejXmdldJweqYzIu2aLixhrjMdz2" ? "mDlFjIykC9WUsB9EIT26mzyhUxm1" : user.uid === uid);
              if (existingUserIndex !== -1) {
                // User already exists in listUserInfo, increment their participation data
                const currentUser = listUserInfo[existingUserIndex];
                listUserInfo[existingUserIndex] = {
                  ...currentUser,
                  data: (parseInt(currentUser.data || '0') + 1).toString(),
                };
              } else {
                // User does not exist, add them to listUserInfo
                listUserInfo.push({
                  uid: uid,
                  name: userData?.firstName + ' ' + userData?.lastName,
                  photo: userData?.photoURL,
                  data: '1',
                });
              }
            }
          }
          else if (ticketData.status == "CANCELED"){
            // TicketsDatas:
            listTicketsRefunded.push(ticketData);
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      }
    });
    await Promise.all(ticketPromises); // Wait for all ticket processing promises to resolve

    // Post processing of the datas:

    // TicketsDatas:
    const ticketDatasAccepted = listTicketsAccepted.map((ticketData) => {
      return {
        id: ticketData.id,
        amount: parseFloat(ticketData.amount),
        date: ticketData.date.toDate(),
      } as TicketDataType;
    });
    const ticketDatasRefunded = listTicketsRefunded.map((ticketData) => {
      return {
        id: ticketData.id,
        amount: parseFloat(ticketData.amount),
        date: ticketData.date.toDate(),
      } as TicketDataType;
    });

    // NationalityCounts:
    const initialNationalities: NationalityData[] = [
      { label: "US", value: 5 },
      { label: "DE", value: 10 },
      { label: "JP", value: 2 },
      { label: "FR", value: 31 },
      { label: "ES", value: 25 },
      { label: "IT", value: 16 },
      { label: "UK", value: 6 },
      { label: "RU", value: 3 },
    ];
  
    const nationalitiesData = calculateAndAdjustNationalitiesData(nationalityCounts, total_nationalities);
  
    // listUserInfo:
    const listUserInfoSorted = getTopUsersWithTies(listUserInfo, 20);
    
    // Retrieve the date of the first event created by the user and create a list with each year from first year to actual year
    const yearList = [];
    if (querySnapshot.docs.length == 0){
      const now = new Date();
      yearList.push(now.getUTCFullYear());
    }
    else{
      const earliestDate = querySnapshot.docs.map(doc => doc.data().information.date.from.toDate()).reduce((minDate, currentDate) => currentDate < minDate ? currentDate : minDate);
      const earliestYear = earliestDate.getUTCFullYear();
      const currentYear = new Date().getUTCFullYear();
      for (let year = earliestYear; year <= currentYear; year++) {
        yearList.push(year);
      }
    }
    const dataYears = aggregateTicketsByYearAndMonth(ticketDatasAccepted, yearList);
 
    return {
      totalNumberTickets: numberTickets,
      totalNumberParticipants: listUserInfo.length,
      ticketDatasAccepted: ticketDatasAccepted,
      ticketDatasRefunded: ticketDatasRefunded,
      nationalitiesData: nationalitiesData,
      listUserInfo: listUserInfoSorted,
      dataYears: dataYears,
    }
    } catch (error) {
      console.error("Error fetching number participants: ", error);
      return null;
    }
}

function calculateAndAdjustNationalitiesData(nationalityCounts: {[key: string]: number}, total_nationalities: number): NationalityData[] {
  let sumOfRounded = 0;
  let maxPercentage = 0;
  let maxLabel: string | null = null;
  const nationalitiesData: NationalityData[] = Object.keys(nationalityCounts).map(key => {
      const rawPercentage = nationalityCounts[key] * 100 / total_nationalities;
      const roundedPercentage = Math.round(rawPercentage);
      sumOfRounded += roundedPercentage;

      // Track the nationality with the biggest value so that we can adjust the percentage on this one.
      if (roundedPercentage > maxPercentage) {
          maxPercentage = roundedPercentage;
          maxLabel = key;
      }

      return { label: key, value: roundedPercentage };
  });

  // Find the index of the nationality with the biggest value
  const maxIndex = nationalitiesData.findIndex(item => item.label === maxLabel);

  // Adjust the biggest value to make sure the total is 100%
  if (maxIndex !== -1) {
      const adjustment = 100 - sumOfRounded;
      nationalitiesData[maxIndex].value += adjustment;
  }

  return nationalitiesData;
}

function sortUserInfo(listUserInfo: UserInfo[]): UserInfo[] {
  return listUserInfo.sort((a, b) => {
    const dataA = parseInt(a.data || '0');
    const dataB = parseInt(b.data || '0');
    // Primary sort by data descending
    if (dataA > dataB) return -1;
    if (dataA < dataB) return 1;

    // Secondary sort by name ascending in case of equality in data
    return a.name.localeCompare(b.name);
  });
}

function getTopUsersWithTies(listUserInfo: UserInfo[], topX: number): UserInfo[] {
  // Ensure the list is sorted first by data descending, then by name ascending
  const sortedUsers = sortUserInfo(listUserInfo);

  // If the list is shorter than or equal to topX, return the whole list
  if (sortedUsers.length <= topX) return sortedUsers;

  // Find the participation count of the Xth user
  const cutoffData = sortedUsers[topX - 1].data;

  // Find the last user who meets or exceeds the cutoff participation count
  const lastIndexWithCutoffData = sortedUsers.findIndex((user, index) => user.data! < cutoffData! && index >= topX);

  if (lastIndexWithCutoffData === -1) { // All remaining users have the same data
    return sortedUsers;
  } else { // Include all users up to the last one with the cutoff participation count
    return sortedUsers.slice(0, lastIndexWithCutoffData);
  }
}

function aggregateTicketsByYearAndMonth(ticketDatasAccepted: TicketDataType[], yearsToInitialize: number[]): DataYear[] {
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const yearsData: DataYear[] = [];

  // This able to initialize the years wanted with full zero even if no tickets has been sold
  yearsToInitialize.forEach(year => {
    if (!yearsData.find(y => y.year === year)) {
      yearsData.push({ year: year, datas: monthLabels.map(label => ({ value: 0, label })) });
    }
  });

  ticketDatasAccepted.forEach(ticket => {
    const year = ticket.date.getUTCFullYear();
    const month = ticket.date.getUTCMonth();

    // Find or initialize the year object
    let yearData = yearsData.find(y => y.year === year);
    if (!yearData) {
      yearData = { year: year, datas: monthLabels.map(label => ({ value: 0, label })) };
      yearsData.push(yearData);
    }
    yearData.datas[month].value += ticket.amount;
  });

  yearsData.sort((a, b) => a.year - b.year);
  yearsData.forEach(yearData => {
    yearData.datas.forEach(monthData => {
      monthData.value = +monthData.value.toFixed(2);
    });
  });

  return yearsData;
}
