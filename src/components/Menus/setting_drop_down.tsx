import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import CircleFlag from "@/components/Flags/circle_flag";
import ChangeLanguageModal from '@/components/Modals/change_language';
import {useDisclosure} from '@nextui-org/react';
import {useTranslations} from 'next-intl';
import {useLocale} from 'next-intl';
import React from "react";

const SettingDropDown: React.FC = () => {
  const t = useTranslations('profileDropDown');
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const lightModeIcon = (
    <Image
      className="bg-transparent"
      src="/icons/profile/moon.svg"
      alt="MoonIcon"
      width={25}
      height={25}
    />
  );

  const darkModeIcon = (
    <Image
      className="bg-transparent"
      src="/icons/profile/sun.svg"
      alt="SunIcon"
      width={25}
      height={25}
    />
  );
  return (
    <>
      <div
        className={"fixed top-0 right-0 p-2 cursor-pointer"}
      >
        <Dropdown>
          <DropdownTrigger>
            <Image
                className="bg-transparent"
                src="/icons/profile/setting.svg"
                alt="setting"
                width={60}
                height={60}
                priority
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="settingMenu">
              <DropdownItem
                key="changeLanguage"
                startContent={<CircleFlag size={25} language={locale} />}
                onPress={onOpen}
              >
                {t('changeLanguage')}
              </DropdownItem>
              <DropdownItem
                key="ThemeMode"
                startContent={theme === "light" ? lightModeIcon : darkModeIcon}
                onPress={() => {
                  if (theme === "light") {
                    setTheme("dark");
                    document.documentElement.style.setProperty(
                      "--foreground-rgb",
                      "255, 255, 255"
                    );
                    document.documentElement.style.setProperty(
                      "--background-start-rgb",
                      "16, 16, 16"
                    );
                    document.documentElement.style.setProperty(
                      "--background-end-rgb",
                      "20, 20, 20"
                    );
                  } else {
                    setTheme("light");
                    document.documentElement.style.setProperty(
                      "--foreground-rgb",
                      "0, 0, 0"
                    );
                    document.documentElement.style.setProperty(
                      "--background-start-rgb",
                      "250, 250, 250"
                    );
                    document.documentElement.style.setProperty(
                      "--background-end-rgb",
                      "220, 220, 220"
                    );
                  }
                }}
              >
                {theme === "light"
                  ? t('dark_mode')
                  : t('light_mode')}
              </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <ChangeLanguageModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default SettingDropDown;
