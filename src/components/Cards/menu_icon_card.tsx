import React, { useState } from "react";
import { Card, CardBody, Image } from "@nextui-org/react";

type MenuIconCardProps = {
  width: number;
  height: number;
  widthIcon: number;
  heightIcon: number;
  image: string;
  selected: boolean;
  onPress: () => void;
};

const MenuIconCard: React.FC<MenuIconCardProps> = ({
  width,
  height,
  widthIcon,
  heightIcon,
  image,
  selected,
  onPress,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const borderRadius = Math.min(Math.min(width, height) * 0.2, 70);

  return (
    <Card
      isPressable={true}

      className={selected ? "bg-redWS shadow-none" : "bg-white dark:bg-darkGray shadow-none"}
      style={{ width: width, height: height, borderRadius: borderRadius }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPress={onPress}
    >
      <div className="w-full h-full flex justify-center items-center">
        <Image
          alt="Card background"
          className={'bg-repeat bg-cover bg-center'}
          src={image}
          radius="none"
          width={widthIcon}
          height={heightIcon}
        />
      </div>
    </Card>
  );
};

export default MenuIconCard;
