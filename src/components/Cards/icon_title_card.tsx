import React from "react";
import { Card, Image } from "@nextui-org/react";

type IconTitleCardProps = {
  title: string;
  image?: string;
  widthCard: number;
  minHeightCard: number;
  sizeImage: number;
  sizeText: number;
  selected: boolean;
  onPress: () => void;
  disable?: boolean;
};

const IconTitleCard: React.FC<IconTitleCardProps> = ({
  title,
  image,
  widthCard,
  minHeightCard,
  sizeImage,
  sizeText,
  selected,
  onPress,
  disable = false,
}) => {
  return (
    <Card
      isDisabled={disable}
      isPressable={true}
      className={selected ? "border-redWS border-2 bg-white dark:bg-darkGray rounded-3xl text-redWS" : "bg-white dark:bg-darkGray rounded-3xl"}
      style={{ width: widthCard, minHeight: minHeightCard}}
      onPress={disable ? () => {} : onPress}
    >
      <div className="w-full h-full flex flex-col justify-evenly items-center p-2 px-4">
        {image && (
          <Image
            alt="Card background"
            className={'bg-repeat bg-cover bg-center'}
            src={image}
            radius="none"
            width={sizeImage}
            height={sizeImage}
          />
        )}
        <div className="font-semibold" style={{ fontSize: sizeText, lineHeight: 1.0 }}>
          {title}
        </div>
      </div>
    </Card>
  );
};

export default IconTitleCard;
