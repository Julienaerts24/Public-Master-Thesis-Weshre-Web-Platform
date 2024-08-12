import React from "react";
import { useRouter, usePathname } from "next/navigation"; // Corrected from 'next/navigation'
import Image from "next/image";

interface MenuItem {
  key: string;
  iconBase: string;
}

const BottomMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const items: MenuItem[] = [
    { key: "myActivities", iconBase: "/icons/sidebar/activities" },
    { key: "myDashboard", iconBase: "/icons/sidebar/dashboard" },
  ];

  const renderIcon = (item: MenuItem, isSelected: boolean) => {
    const iconSrc = `${item.iconBase}_${isSelected ? "selected" : "notSelected"}.png`;
    return (
      <Image
        src={iconSrc}
        alt={`${item.key}Icon`}
        width={55}
        height={55}
      />
    );
  };

  return (
    <div className="w-full h-full flex flex-row flex-shrink-0 justify-center items-center overflow-hidden">
      {items.map((item) => {
        const isSelected = pathname.includes(item.key);
        return (
          <div
            key={item.key}
            className="w-1/2 flex justify-center items-center px-3"
            onClick={() => router.push(`/${item.key}`)}
          >
            {renderIcon(item, isSelected)}
          </div>
        );
      })}
    </div>
  );
};

export default BottomMenu;
