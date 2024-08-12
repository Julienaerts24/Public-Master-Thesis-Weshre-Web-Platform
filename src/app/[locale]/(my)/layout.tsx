"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDropDown from "@/components/Menus/profile_drop_down";
import SideMenu from "@/components/Menus/side_menu";
import BottomMenu from "@/components/Menus/bottom_menu";
import { useAuth } from "@/context/AuthContext";
import LoadingDots from "@/components/Loading";
import { useSetAtom } from "jotai";
import { AvailableHeightAtom } from "@/atoms/atoms_events";
import { Card } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

interface MyLayoutProps {
  children: React.ReactNode;
}

export default function MyLayout({ children }: MyLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const setAvailableHeight = useSetAtom(AvailableHeightAtom);

  useEffect(() => {
    if (user === undefined) {
      setIsLoading(true);
    } else if (user === null || !user.uid) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
      setAvailableHeight(
        window.innerWidth >= 640
          ? window.innerHeight - 152
          : window.innerHeight - 239
      );
    };

    // Check on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <LoadingDots size={50} />
      </div>
    );
  }

  return (
    <>
      {isSmallScreen ? (
        <div className="flex flex-col h-screen w-screen">
          <nav className="w-full h-[72px] shrink-0">
            <ProfileDropDown />
          </nav>
          <div className="flex-grow shrink-1 overflow-hidden">{children}</div>
          <div className="w-full h-[87px] shrink-0 px-2 pb-2">
            <div className="w-full h-full bg-white dark:bg-darkGray rounded-2xl shadow-2xl">
              <BottomMenu />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
          <nav className="w-full h-[72px] shrink-0 flex flex-row justify-between items-center pl-2 z-30">
            <Card
              className="bg-transparent"
              shadow="none"
              isPressable
            >
              <Image
                alt="Card background"
                className=""
                src="/images/weshre_logo_name_color.png"
                radius="none"
                width={3.1 * 55}
                height={55}
                onClick={() => router.push("/myActivities")}
              />
            </Card>
            <ProfileDropDown />
          </nav>
          <div className="flex h-full w-fit items-center z-20">
            <div className="flex h-fit w-fit bg-white dark:bg-darkGray rounded-xl shadow-3xl ml-2">
              <SideMenu />
            </div>
          </div>
          <div className="absolute w-full h-full top-0 pt-[72px] left-0 pl-[88px] flex-grow shrink-1 overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </>
  );
}

/* SAVE SIDEMENU
<div className="flex h-full w-fit items-center z-20">
  <div className="flex h-fit w-fit bg-white dark:bg-darkGray rounded-xl shadow-3xl ml-2">
    <SideMenu />
  </div>
</div>

OR

<div className="flex-none h-full w-fit bg-white dark:bg-darkGray z-20 rounded-xl shadow-xl ml-2 pt-4">
  <SideMenu />
</div>
*/