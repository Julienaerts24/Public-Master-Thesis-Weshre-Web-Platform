import React from "react";
import { Button, Image} from "@nextui-org/react";

type FlagButtonProps = {
  lang: string;
  text: string;
  width: number;
  height: number;
  fontSize: number;
  onPress: () => void;
};

const FlagButton: React.FC<FlagButtonProps> = ({ lang, text, width, height, fontSize, onPress}) => {
  const iconFileAddress = `/flags/rectangle/${lang}.png`;

  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        className="flex items-center justify-center p-0 bg-transparent"
        style={{ width: width, height: height }}
        onPress={onPress}
      >
        <Image
          alt={`${lang} flag`}
          className="bg-repeat bg-cover bg-center"
          src={iconFileAddress}
          radius="none"
          style={{ width: width, height: height }}
        />
      </Button>
      <div className="font-bold" style={{fontSize: `${fontSize}px`}}>{text}</div>
    </div>
  );
};

export default FlagButton;
