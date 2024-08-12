'use client'

import React, { useEffect, useState } from "react";
import { Button, Tooltip} from "@nextui-org/react";
import Image from "next/image";

type TooltipPlacement =
  | "top"
  | "bottom"
  | "right"
  | "left"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";

type CircleIconButtonProps = {
  circleSize: number;
  circleColor: string;
  messageToolTip?: string;
  placementToolTip?: TooltipPlacement;
  isDisabled?: boolean;
  iconFileAddress: string;
  iconSize: number;
  onClick: () => void;
  sizeMessage?: number;
  sizePaddingMessage?: number;
  responsiveness?: number; // From 0 to 100 => 0 equal zero change when XL, md or sm
}

const CircleIconButton: React.FC<CircleIconButtonProps> = ({
  circleSize,
  circleColor,
  messageToolTip = '',
  placementToolTip = 'left',
  isDisabled = false,
  iconFileAddress,
  iconSize,
  onClick,
  sizeMessage = 10,
  sizePaddingMessage = 5,
  responsiveness = 20, // initial value base on the fact that it was add after already use so to not modify the original behaviour but add the option
}) => {

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

  const adaptableCircleSize = isMdScreen ? isXlScreen ? circleSize : circleSize * ((100 - responsiveness)/100) : circleSize * ((100 - (2*responsiveness))/100);
  const adaptableIconSize = isMdScreen ? isXlScreen ? iconSize : iconSize * ((100 - responsiveness)/100) : iconSize * ((100 - (2*responsiveness))/100);
  const adaptableSizeMessage = isMdScreen ? isXlScreen ? sizeMessage : sizeMessage * ((100 - (responsiveness/2))/100) : sizeMessage * ((100 - (responsiveness))/100);
  const adaptableSizePaddingMessage = isMdScreen ? isXlScreen ? sizePaddingMessage : sizePaddingMessage * ((100 - (responsiveness/2))/100) : sizePaddingMessage * ((100 - (responsiveness))/100);

  return (
    <Tooltip
      isDisabled={messageToolTip==""}
      color={"default"}
      placement={placementToolTip}
      delay={300}
      content={
        <div className="font-bold"
        style={{
          fontSize: Math.round(adaptableSizeMessage),
          padding: adaptableSizePaddingMessage,
        }}
        >{messageToolTip}</div>
      }
    >
      <Button
        isDisabled={isDisabled}
        style={{
          minWidth: '0',
          minHeight: '0', 
          padding: '0',
          width: `${adaptableCircleSize}px`,
          height: `${adaptableCircleSize}px`,
          backgroundColor: circleColor,
          clipPath: "circle()",
        }}
        onClick={onClick}
      >
        <Image
          alt="icon"
          src={iconFileAddress}
          height={adaptableIconSize}
          width={adaptableIconSize}
        />
      </Button>
    </Tooltip>
  );
};

export default CircleIconButton;