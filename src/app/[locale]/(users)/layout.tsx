"use client";

import SettingDropDown from "@/components/Menus/setting_drop_down";

export default function usersLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
      <nav className="h-[47px] sm:h-[72px] w-screen fixed top-0 left-0 p-2">
          <div className="fixed top-0 right-0 p-2">
            <SettingDropDown />
          </div>
      </nav>
      <main>{children}</main>
      </>
      )
  }