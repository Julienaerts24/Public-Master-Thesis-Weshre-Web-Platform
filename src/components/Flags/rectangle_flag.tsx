import React from "react";
import Image from "next/image";

type  RectangleFlagProps = {
  width: number;
  height: number;
  language: string;
}

const RectangleFlag: React.FC<RectangleFlagProps> = ({
  width,
  height,
  language,
}) => {
  const iconFileAddress = `/flags/rectangle/${language}.png`;

  return (
    <Image
      alt={`${language} flag`}
      src={iconFileAddress}
      height={height}
      width={width}
    />
  );
};

export default RectangleFlag;