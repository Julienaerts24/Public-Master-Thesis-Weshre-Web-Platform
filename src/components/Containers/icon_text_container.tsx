'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

type  CircleTextContainerProps = {
  text: string;
  sizeIcon?: number;
  icon?: string;
  responsiveness?: number; // From 0 to 100 => 0 equal zero change when XL, md or sm
}

const CircleTextContainer: React.FC<CircleTextContainerProps> = ({
  text,
  sizeIcon = 20,
  icon,
  responsiveness = 0, // initial value base on the fact that it was add after already use so to not modify the original behaviour but add the option
}) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || (!theme && resolvedTheme === "dark");

  const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
  const [isXlScreen, setIsXlScreen] = useState(window.innerWidth >= 1280);

  useEffect(() => {
    const updateSize = () => {
      setIsMdScreen(window.innerWidth >= 768);
      setIsXlScreen(window.innerWidth >= 1280);
    };

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const adaptableSizeIcon = isMdScreen ? isXlScreen ? sizeIcon : sizeIcon * ((100 - (responsiveness/2))/100) : sizeIcon * ((100 - (responsiveness))/100);

  return (
    <div className="flex flex-row justify-start items-center">
      { icon && <Image
          alt="icon"
          src={isDark ? icon.replace(".svg", "_dark.svg") : icon}
          height={adaptableSizeIcon * 1.1}
          width={adaptableSizeIcon * 1.1}
        />}
        <div className={`text-base lg:text-xl xl:text-2xl font-light max-sm:text-justify ${icon && "pl-6"}`}>
        {text}
        </div>
    </div>
  );
};

export default CircleTextContainer;