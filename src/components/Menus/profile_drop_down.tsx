import { useAuth } from "@/context/AuthContext";
import {Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, User} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { HiOutlineLogout } from "react-icons/hi";
import { useTheme } from "next-themes";
import CircleFlag from "@/components/Flags/circle_flag";
import ChangeLanguageModal from '@/components/Modals/change_language';
import {useDisclosure, Image} from '@nextui-org/react';
import {useTranslations} from 'next-intl';
import {useLocale} from 'next-intl';

const ProfileDropDown: React.FC = () => {
  const t = useTranslations('profileDropDown');
  const locale = useLocale();
  const router = useRouter();
  const { user, logOut } = useAuth();
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
        className={
          user.displayName
            ? "fixed h-[72px] top-0 right-0 p-2 cursor-pointer"
            : "fixed h-[72x] w-[72px] top-0 right-0 p-2 cursor-pointer"
        }
      >
        <Dropdown className="bg-lightBackground dark:bg-darkGray">
          <DropdownTrigger>
            <User
              name={user.displayName}
              isFocusable={true}
              avatarProps={{
                src: user.photoURL,
                size: "lg",
                radius: "md",
                classNames: { base: "bg-white dark:bg-darkGray" },
              }}
              classNames={{
                name: "font-bold cursor-pointer text-lg",
              }}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="settingMenu">
            <DropdownSection showDivider aria-label="settingSection1">
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
            </DropdownSection>
            <DropdownSection aria-label="settingSection2">
              <DropdownItem
                onPress={() => {
                  router.push("/login");
                  logOut();
                }}
                key="logout"
                className="text-white bg-redWS"
                startContent={
                  <HiOutlineLogout className="text-[25px] p-[1%]" />
                }
              >
                {t('sign_out')}
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
      <ChangeLanguageModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default ProfileDropDown;
