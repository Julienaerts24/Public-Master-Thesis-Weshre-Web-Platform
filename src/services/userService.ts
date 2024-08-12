import { UserInfo } from "@/services/eventService";

export async function getUids(): Promise<string[]> {
    // Return a hardcoded list of uids for now
    return ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'];
  }
  
export async function getUserInfo(uid: string): Promise<UserInfo> {
  // Simulating a delay (e.g., for a database call)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Futur call to the database
  switch (uid) {
    case "user1":
      return {
        uid: uid,
        name: "Emma Johnson",
        photo: "/./images/wayback.jpg",
      };
    case "user2":
      return {
        uid: uid,
        name: "Liam Smith",
        photo: "/./images/wayback.jpg",
      };
    case "user3":
      return {
        uid: uid,
        name: "Olivia Brown",
        photo: "/./images/wayback.jpg",
      };
    case "user4":
      return {
        uid: uid,
        name: "Noah Davis",
        photo: "/./images/wayback.jpg",
      };
    case "user5":
      return {
        uid: uid,
        name: "Ava Martinez",
        photo: "/./images/wayback.jpg",
      };
    case "user6":
      return {
        uid: uid,
        name: "William Garcia",
        photo: "/./images/wayback.jpg",
      };
      case "user7":
        return {
          uid: uid,
          name: "Sophia Wilsona",
          photo: "/./images/wayback.jpg",
        };
      case "user8":
        return {
          uid: uid,
          name: "Sophia Wilson",
          photo: "/./images/wayback.jpg",
        };
    default:
      return {
        uid: uid,
        name: "Sophia Wilson",
        photo: "/./images/wayback.jpg",
      };
  }
}

export async function getListOfUserInfo(uids: string[]): Promise<UserInfo[]> {
  const userInfoPromises = uids.map((uid) => getUserInfo(uid));
  const userInfos = await Promise.all(userInfoPromises);

  return userInfos;
}
