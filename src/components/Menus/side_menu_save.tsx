"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
import { Listbox, ListboxItem } from "@nextui-org/react";
import Image from "next/image";
import {useTranslations} from 'next-intl';

const SideMenu: React.FC = () => {
  const t = useTranslations('SideMenu');
  const router = useRouter();
  const [logoIsDisplay, setLogoIsDisplay] = useState(false); // New state
  const pathname = usePathname()
  const hoverTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const [sideBarIsDisplay, setSideBarIsDisplay] = useState(false)

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current !== null) {
        clearTimeout(hoverTimeoutRef.current as any);
    } 
    setSideBarIsDisplay(true);
    setLogoIsDisplay(true);
};

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setSideBarIsDisplay(false);
      setTimeout(() => setLogoIsDisplay(false), 150); // Delayed logo change
    }, 500);
  };

  const items = [
    {
      key: "myActivities",
      label: t('myActivities'),
      icon: (
        <Image
          src="/icons/sidebar/activities_notSelected.png" // https://icons8.com/
          alt="ActivitiesIcon"
          width={55}
          height={55}
        />
      ),
      selectedIcon: (
        <Image
          src="/icons/sidebar/activities_selected.png" // https://icons8.com/
          alt="ActivitiesIcon"
          width={55}
          height={55}
        />
      ),
    },
    {
      key: "myDashboard",
      label: t('myDashboard'),
      icon: (
        <Image
          src="/icons/sidebar/dashboard_notSelected.png" // https://icons8.com/
          alt="DashboardIcon"
          width={55}
          height={55}
        />
      ),
      selectedIcon: (
        <Image
          src="/icons/sidebar/dashboard_selected.png" // https://icons8.com/
          alt="DashboardIcon"
          width={55}
          height={55}
        />
      ),
    },
    {
      key: "myPayments",
      label: t('myPayments'),
      icon: (
        <Image
          src="/icons/sidebar/payment_notSelected.png" // <a target="_blank" href="https://icons8.com/icon/uY7ZEuGXILwn/control-panel">Dashboard</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
          alt="PaymentsIcon"
          width={55}
          height={55}
        />
      ),
      selectedIcon: (
        <Image
          src="/icons/sidebar/payment_selected.png" // https://icons8.com/
          alt="PaymentsIcon"
          width={55}
          height={55}
        />
      ),
    },
    {
      key: "myCalendar",
      label: t('myCalendar'),
      icon: (
        <Image
          src="/icons/sidebar/calendar_notSelected.png" // https://icons8.com/
          alt="CalendarIcon"
          width={55}
          height={55}
        />
      ),
      selectedIcon: (
        <Image
          src="/icons/sidebar/calendar_selected.png" // https://icons8.com/
          alt="CalendarIcon"
          width={55}
          height={55}
        />
      ),
    },
    {
      key: "myMessages",
      label: t('myMessages'),
      icon: (
        <Image
          src="/icons/sidebar/message_notSelected.png" // https://icons8.com/
          alt="MessagesIcon"
          width={55}
          height={55}
        />
      ),
      selectedIcon: (
        <Image
          src="/icons/sidebar/message_selected.png" // https://icons8.com/
          alt="MessagesIcon"
          width={55}
          height={55}
        />
      ),
    },
  ];

  const handleItemPress = (key: string) => {
    switch (key) {
      case "myDashboard":
        router.push("/myDashboard");
        break;
      case "myActivities":
        router.push("/myActivities");
        break;
      case "myPayments":
        router.push("/myPayments");
        break;
      case "myCalendar":
        router.push("/myCalendar");
        break;
      case "myMessages":
        router.push("/myMessages");
        break;
      default:
        break;
    }
  };
  return (
    <div
    className={`transition-all duration-1000 ease-in-out ${sideBarIsDisplay ? "h-screen flex flex-col max-w-[400px] justify-start items-start overflow-hidden" : "h-screen flex flex-col max-w-[80px] justify-start items-start overflow-hidden"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full flex flex-row justify-start items-center my-5 mx-1 pl-3">
        <div className="flex h-full w-14 shrink-0">
          <Image
            src="/images/weshre_logo_color.png"
            height="35"
            width="50"
            alt="WeShre logo"
          />
        </div>
        {logoIsDisplay && (
          <div className="flex max-h-16 w-full overflow-hidden self-end">
            <Image
              src="/images/weshre_name_color.png"
              height="35"
              width="140"
              alt="WeShre name"
            />
          </div>
        )}
      </div>

      <Listbox items={items} onAction={(key) => handleItemPress(String(key))} aria-label="SideMenu Icon">
        {(item) => (
          <ListboxItem className="h-16 w-full" key={item.key} textValue={item.label}>
            <div className="w-full h-full flex flex-row justify-start items-center">
              <div className="flex h-full w-14 shrink-0">
                {pathname.includes(item.key) ? item.selectedIcon : item.icon}
              </div>
              <div className={`flex max-h-16 w-full overflow-x-hidden font-semibold text-2xl pl-2 ${pathname.includes(item.key) ? 'text-redWS' : 'text-grayIcon'}`}>
                {item.label}
              </div>
            </div>
          </ListboxItem>
        )}
      </Listbox>
    </div>
  );
}

export default SideMenu;