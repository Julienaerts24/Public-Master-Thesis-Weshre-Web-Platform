import React from "react";
import Image from "next/image";

type CircleFlagProps = {
  size: number;
  language: string;
}

const CircleFlag: React.FC<CircleFlagProps> = ({
    size,
  language,
}) => {
  const iconFileAddress = `/flags/circle/${language}.png`; // Update this line as needed

  return (
      <Image
        alt={`${language} flag`}
        src={iconFileAddress}
        height={size}
        width={size}
      />
  );
};

export default CircleFlag;