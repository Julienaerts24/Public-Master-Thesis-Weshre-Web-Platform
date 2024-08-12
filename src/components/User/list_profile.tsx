import React, { useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Listbox, ListboxItem, Skeleton, Tooltip} from "@nextui-org/react";
import ProfileName from "@/components/User/profile_Name";
import { useTranslations } from "next-intl";
import { UserInfo } from "@/services/eventService";
import ResearchInput from "@/components/Inputs/search_input";

type ListProfileProps = {
  title: string;
  height: number;
  width: number;
  listUserInfo: UserInfo[];
  isLoading: boolean;
  needSorted?: boolean;
  unitData?: string;
};

const ListProfile: React.FC<ListProfileProps> = ({
  title,
  height,
  width,
  listUserInfo,
  isLoading,
  needSorted = true,
  unitData = undefined,
}) => {
  const t = useTranslations("ListProfile");
  const heigthPhoto = width > 260 ? 76 : 68;
  const minHeight = 60 + heigthPhoto + heigthPhoto;
  const userHeight = Math.max(height - 60 - heigthPhoto, heigthPhoto);
  const maxDisplayUser = Math.max(Math.floor(userHeight / heigthPhoto), 1);
  const heightUser = Math.floor(userHeight / maxDisplayUser);
  const paddingTitle = userHeight - (heightUser * maxDisplayUser);
  const [search, setSearch] = useState("");
  const sortedListUserInfo = needSorted ? [...listUserInfo].sort((a, b) => a.name.localeCompare(b.name)) : [...listUserInfo];

  const filteredListUserInfo = sortedListUserInfo.filter((userInfo) => {
    const searchTerm = search.toLowerCase();

    // return userInfo.name.toLowerCase().split(' ').some(word => word.startsWith(searchTerm));
    return userInfo.name.toLowerCase().includes(searchTerm);
  });
    
  const size = width > 260 ? "lg" : width > 230 ? "base" : "sm"
  const sizeUnit = width > 350 ? "lg" : width > 320 ? "base" : width > 280 ? "sm" : "xs"
  return (
    <Card
      className="w-full shadow-none cursor-default"
      style={{height: height, minHeight: minHeight, borderRadius: 35}}
    >
      <CardBody className="w-full flex flex-col justify-start items-center bg-white dark:bg-darkGray py-0 px-0">
        <div
          className="w-full flex-shrink-0 font-semibold text-[22px] textline-clamp-1 px-4 flex justify-center items-center text-center overflow-hidden"
          style={{height: 60 + paddingTitle}}
        >
          {title}
        </div>
        <div className="w-full h-full overflow-y-auto snap-y snap-proximity mt-0">
          {
            <div className="w-full h-full flex-shrink-1 overflow-y-auto snap-y snap-proximity">
              {isLoading ? (
                // Show loading skeletons
                Array.from({ length: maxDisplayUser }).map((_, index) => (
                  <div key={index} className="mx-3 flex items-center gap-2" style={{height: heightUser}}>
                    <div>
                      <Skeleton className="flex rounded-lg w-14 h-14" />
                    </div>
                    <div className="w-full">
                      <Skeleton className="h-[28px] rounded-sm" />
                    </div>
                  </div>
                ))
              ) : filteredListUserInfo.length === 0 ? (
                listUserInfo.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-center font-bold text-lg p-2">{t("noUser")}</div>
                  // TODO: add button to invite some people? or to partage it.
                ) : 
                  <div className="w-full h-full flex items-center justify-center text-center font-bold text-lg p-2">{t("noResult")}</div>
              ) : (
                // Show the list of users
                <Listbox
                  className="h-full cursor-default"
                  aria-label="Users List"
                  // onAction={(key) => alert(key)}
                >
                  {filteredListUserInfo.map((userInfo) => (
                    <ListboxItem className="listboxItem relative group snap-start" key={userInfo.uid} style={{height: heightUser - 1.75}} textValue={userInfo.name}>
                      <div className="h-full w-full flex flex-row justify-between items-center cursor-default">
                            <div className="truncate">
                              <ProfileName userInfo={userInfo} size={size}/>
                            </div>
                            <div className={`${width <= 220 ? 'group-hover:opacity-100 group-hover:visible group-hover:mx-[5%] opacity-0 invisible w-0 group-hover:w-auto' : 'opacity-100 visible w-auto'} transition-opacity duration-300`}>
                              <div className={`flex ${width > 450 ? 'flex-row gap-1' : 'flex-col'} justify-center items-center w-auto h-full mx-[2%] transition-opacity duration-300`}>
                                {userInfo.data !== undefined && (
                                  <div className={`w-auto font-semibold whitespace-nowrap ${"text-" + size}`}>
                                    {userInfo.data}
                                  </div>
                                )}
                                {unitData !== undefined && (
                                  <div className={`w-auto font-semibold whitespace-nowrap ${"text-" + sizeUnit}`}>
                                    {unitData}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                    </ListboxItem>
                  ))}
                </Listbox>
              )}
            </div>
          }
        </div>
        <div className="w-full h-[76px] flex-shrink-0 px-3 pb-3 rounded-2xl shadow-lg">
          <ResearchInput
            search={search}
            setSearch={setSearch}
            size="md"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default ListProfile;