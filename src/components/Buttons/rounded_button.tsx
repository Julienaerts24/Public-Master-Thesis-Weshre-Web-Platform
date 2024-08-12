'use client'

import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import Image from "next/image";

type  RoundedButtonProps = {
  text: string;
  sizeText: number;
  onClick: () => void;
  size?: "sm"|"md"|"lg"
  disabled?: boolean;
  icon?: string;
  radius?: "sm"|"md"|"lg"|"none"|"full";
  color?: "default"| "primary"| "secondary"| "success"| "warning" | "danger";
  isError?: Boolean
  responsiveness?: number; // From 0 to 100 => 0 equal zero change when XL, md or sm
}

const RoundedButton: React.FC<RoundedButtonProps> = ({
  text,
  sizeText,
  onClick,
  size = "lg",
  disabled = false,
  icon,
  radius = "lg",
  color = "primary",
  isError = false,
  responsiveness = 0, // initial value base on the fact that it was add after already use so to not modify the original behaviour but add the option
}) => {

  
  const savePaddingMap = {
    sm: "px-2 py-3",
    md: "px-3 py-4",
    lg: "px-3 py-5",
  };

  const paddingMap = {
    sm: "px-3 py-4",
    md: "px-4 py-6",
    lg: "px-6 py-8",
  };

  const paddingIconMap = {
    sm: "pl-1",
    md: "pl-2",
    lg: "pl-3",
  };

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

  const adaptableSize = size === "sm" ? "sm" : size === "md" && responsiveness >= 20 && !isMdScreen ? "sm" : size === "md" || (size === "lg" && responsiveness >= 20 && !isXlScreen) ? "md" : "lg";
  const paddingClass = paddingMap[adaptableSize];
  const paddingIconClass = paddingIconMap[adaptableSize];
  const adaptableSizeText = isMdScreen ? isXlScreen ? sizeText : sizeText * ((100 - (responsiveness/2))/100) : sizeText * ((100 - (responsiveness))/100);

  return (
    <Button
      className={`text-white font-bold ${paddingClass} ${disabled ? "cursor-not-allowed" : ""}`}
      color={isError ? "danger" : color}
      style={{ fontSize: `${adaptableSizeText}px` }}
      onClick={onClick}
      size={size}
      radius={radius}
      isDisabled={disabled}
    >
      { icon && <Image
          alt="icon"
          src={icon}
          height={adaptableSizeText * 1.1}
          width={adaptableSizeText * 1.1}
        />}
        <div className={` ${icon && paddingIconClass}`}>
        {text}
        </div>
    </Button>
  );
};

export default RoundedButton;