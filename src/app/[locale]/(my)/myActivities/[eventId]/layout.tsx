"use client";

import CircleIconButton from "@/components/Buttons/circle_icon_button";
import { useEffect, useState } from "react";
import { getEvent } from "@/services/eventService";
import LoadingDots from "@/components/Loading";
import { useTranslations } from "next-intl";
import ListProfile from "@/components/User/list_profile";
import { UserInfo, getUsersEvent } from "@/services/eventService";
import { useAtom } from "jotai";
import {OpenParticipantsAtom, EventDataAtom, AvailableHeightAtom} from "@/atoms/atoms_events";
import { usePathname } from "next/navigation";
import { useNavigationBack } from "@/hooks/useNavigation";
import RedRoundedButton from "@/components/Buttons/rounded_button";
import ErrorBoundaryCard from "@/components/Errors/error_boundary_card";

type EventParticipantsLayoutProps = {
  children: React.ReactNode;
};

export default function EventParticipantsLayout({
  children,
}: EventParticipantsLayoutProps) {
  const t = useTranslations("EventPage");
  const t_error = useTranslations("ErrorBoundaryCard");
  const navigateBack = useNavigationBack();
  const [eventData, setEventData] = useAtom(EventDataAtom);
  const pathname = usePathname();
  const eventId = pathname.split("/").pop();
  const [availableHeight, setAvailableHeight] = useAtom(AvailableHeightAtom);
  const [listUserInfo, setListUserInfo] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventExist, setEventExist] = useState(true);
  const [openAtom, setOpenAtom] = useAtom(OpenParticipantsAtom);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth >= 640);
  const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
  const [isLgScreen, setIsLgScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const updateSize = () => {
      setAvailableHeight(window.innerWidth >= 640 ? window.innerHeight - 160 : window.innerHeight - 239);
      setIsSmallScreen(window.innerWidth >= 640);
      setIsMdScreen(window.innerWidth >= 768);
      setIsLgScreen(window.innerWidth >= 1024);
    };

    async function getEventData() {
      if (eventId) {
        setIsLoading(true);
        const EventData = await getEvent(eventId);
        if(EventData == null){
          setEventExist(false)
        }
        else{
          setEventData(EventData);
          const UserData = await getUsersEvent(eventId);
          setListUserInfo(UserData)
        }
        setIsLoading(false);
      }
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    getEventData();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <LoadingDots size={50} />
      </div>
    );
  }

  if (!eventExist) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center px-5">
        <div className="text-xl lg:text-2xl xl:text-3xl font-bold pb-5 text-center"> {t('no_event_id')} </div>
        <RedRoundedButton
          text={t('go_back')}
          sizeText={24}
          onClick={navigateBack}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full"
        style={{ width: isSmallScreen ? '100% - 80px' : '100%' }}
      >
        <div className="flex flex-row w-full justify-between items-center flex-shrink-0 px-5 h-[80px]">
          <div className="text-3xl xl:text-4xl 2xl:text-5xl font-bold ">
            {eventData?.title}
          </div>
          <CircleIconButton
            circleSize={60}
            iconSize={30}
            sizeMessage={18}
            sizePaddingMessage={13}
            circleColor="#ff5757"
            messageToolTip={t("tip_back")}
            iconFileAddress="/icons/left_arrow_white.svg"
            onClick={() => {
              navigateBack();
            }}
          />
        </div>
        <div className="w-full flex flex-row" style={{height: "100% - 239px"}}>
          <div className={`w-full h-full overflow-hidden ${openAtom ? 'max-md:hidden' : ''}`}>
            {children}
          </div>
          <div className={`h-full p-8 lg:pr-0 pt-4 md:pt-8 flex-shrink-0 overflow-hidden lg:mr-[15%] ${openAtom ? '' : 'max-md:hidden'}`}
            style={{width: isMdScreen ? (isLgScreen ? 450 : 400) : '100%'}}
          >
            <ErrorBoundaryCard errorMessage={t_error("unexpected_error")}>
              <ListProfile
                title={t("participants")}
                height={isMdScreen ? availableHeight! - 48 - 32: availableHeight! - 48}
                width={300}
                listUserInfo={listUserInfo}
                needSorted={false}
                isLoading={isLoading}
              />
            </ErrorBoundaryCard>
          </div>
          <div className={'absolute right-0 top-40 p-2 md:hidden'}>
              <CircleIconButton
                circleSize={50}
                iconSize={40}
                sizeMessage={22}
                sizePaddingMessage={13}
                circleColor="#ff5757"
                iconFileAddress={
                  openAtom
                    ? "/icons/open_participants.svg"
                    : "/icons/close_participants.svg"
                }
                messageToolTip={
                  openAtom ? t("hide_participants") : t("show_participants")
                }
                onClick={() => {
                  setOpenAtom(!openAtom);
                }}
              />
            </div>
        </div>
      </div>
    </>
  );
}