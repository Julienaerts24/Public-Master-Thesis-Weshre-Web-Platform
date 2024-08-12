"use client";

import React, { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Listbox, ListboxItem } from "@nextui-org/react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const SideMenu: React.FC = () => {
  const t = useTranslations("SideMenu");
  const router = useRouter();
  const pathname = usePathname();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const [sideBarIsDisplay, setSideBarIsDisplay] = useState(false);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current !== null) {
      clearTimeout(hoverTimeoutRef.current as any);
    }
    setSideBarIsDisplay(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setSideBarIsDisplay(false);
    }, 500);
  };

  const items = [
    {
      key: "myActivities",
      label: t("myActivities"),
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
      label: t("myDashboard"),
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
  ];

  const handleItemPress = (key: string) => {
    switch (key) {
      case "myDashboard":
        router.push("/myDashboard");
        break;
      case "myActivities":
        router.push("/myActivities");
        break;
      default:
        break;
    }
  };
  return (
    <div
      className={`h-full flex flex-col justify-start items-start overflow-hidden transition-all duration-1000 ease-in-out ${
        sideBarIsDisplay ? "max-w-[400px]" : "max-w-[80px]"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Listbox
        items={items}
        onAction={(key) => handleItemPress(String(key))}
        aria-label="SideMenu Icon"
      >
        {(item) => (
          <ListboxItem
            className="h-28 w-full py-2"
            key={item.key}
            textValue={item.label}
          >
            <div className="w-full h-full flex flex-row justify-start items-center">
              <div className="flex h-full w-14 shrink-0">
                {pathname.includes(item.key) ? item.selectedIcon : item.icon}
              </div>
              <div
                className={`flex max-h-16 w-full overflow-x-hidden font-semibold text-2xl pl-2 ${
                  pathname.includes(item.key) ? "text-redWS" : "text-grayIcon"
                }`}
              >
                {item.label}
              </div>
            </div>
          </ListboxItem>
        )}
      </Listbox>
    </div>
  );
};

export default SideMenu;
