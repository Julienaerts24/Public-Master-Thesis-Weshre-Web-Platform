"use client";

import React from "react";
import { usePathname } from 'next/navigation'
import MenuIconCard from "@/components/Cards/menu_icon_card";
import { useNavigation } from "@/hooks/useNavigation";

const EventMenu: React.FC = () => {
  const navigate = useNavigation();
  const currentPathname = usePathname()
  const pathSegments = currentPathname.split("/");
    const eventPage = pathSegments[pathSegments.length - 1];

  return (
    <div className={"w-full flex flex-row flex-shrink-1 pb-8 justify-center items-center overflow-hidden"}>
        <div className="p-3">
            {eventPage == 'chat' ? 
            <MenuIconCard width={100} height={100} widthIcon={70} heightIcon={70} selected={true} image="/icons/sidebar/message_notSelected.png" onPress={() => {}}/> : 
            <MenuIconCard width={100} height={100} widthIcon={70} heightIcon={70} selected={false} image="/icons/sidebar/message_notSelected.png" onPress={() => navigate('chat')}/>
            }
        </div>
        <div className="p-3">
            {eventPage == 'informations' ? 
            <MenuIconCard width={100} height={100} widthIcon={70} heightIcon={70} selected={true} image="/icons/sidebar/activities_notSelected.png" onPress={() => {}}/> : 
            <MenuIconCard width={100} height={100} widthIcon={70} heightIcon={70} selected={false} image="/icons/sidebar/activities_notSelected.png" onPress={() => navigate('informations')}/>
            }
        </div>
        <div className="p-3">
            {eventPage == 'feed' ? 
            <MenuIconCard width={100} height={100} widthIcon={70} heightIcon={70} selected={true} image="/icons/sidebar/calendar_notSelected.png" onPress={() => {}}/> : 
            <MenuIconCard width={100} height={100} widthIcon={70} heightIcon={70} selected={false} image="/icons/sidebar/calendar_notSelected.png" onPress={() => navigate('feed')}/>
            }
        </div>
        <div className="p-3">
            {eventPage == 'galery' ? 
            <MenuIconCard width={100} height={100} widthIcon={70} heightIcon={70} selected={true} image="/icons/sidebar/dashboard_notSelected.png" onPress={() => {}}/> : 
            <MenuIconCard width={100} height={100} widthIcon={70} heightIcon={70} selected={false} image="/icons/sidebar/dashboard_notSelected.png" onPress={() => navigate('galery')}/>
            }
        </div>
    </div>  
  );
}

export default EventMenu;