import React from "react";
import Image from "next/image";

type CircleIconProps = {
  circleSize: number;
  circleColor: string;
  iconFileAddress: string;
  iconSize: number;
}

const CircleIcon: React.FC<CircleIconProps> = ({
  circleSize,
  circleColor,
  iconFileAddress,
  iconSize,
}) => {

  return (
      <div
        style={{
          minWidth: '0',
          minHeight: '0', 
          padding: '0',
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          backgroundColor: circleColor,
          clipPath: "circle()",
        }}
      >
        <div className="flex h-full justify-center items-center">
            <Image
            alt="icon"
            src={iconFileAddress}
            height={iconSize}
            width={iconSize}
            />
        </div>
      </div>
  );
};

export default CircleIcon;