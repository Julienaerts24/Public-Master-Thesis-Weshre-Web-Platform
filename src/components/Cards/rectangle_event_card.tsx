import React from "react";
import { Card, CardBody, Image } from "@nextui-org/react";
import CircleIcon from "@/components/Containers/circle_icon";
import {formatEventDate, formatEventTime} from "@/utils/formattedDate";

type RectangleEventCardProps = {
  width: number;
  height: number;
  title: string;
  description: string;
  date: Date;
  image: string;
  onPress: () => void
}

const RectangleEventCard: React.FC<RectangleEventCardProps> = ({
  width,
  height,
  title,
  description,
  date,
  image,
  onPress,
}) => {
  const fontSizeTitle = Math.round(height * 0.07);
  const fontSizeDescription = Math.max(10, Math.round(height * 0.040));
  const lineHeightDescription = Math.min(1.7, Math.round(height * 0.008));
  const fontSizeDate = Math.round(height * 0.05);
  const circleSize = 55

  return (
      <Card isPressable={true} 
        className="shadow-none"
        style={{ width: width, height: height, borderRadius: 35}}
        onPress={onPress}
      >
        <Image
          alt="Card background"
          className="w-full object-cover"
          style={{ width: width, height: height * 9 / 16 }}
          src={image} /*"/images/test_image_size.jpg"*/
          radius="none"
        />
        <CardBody className="w-full h-[7/16] flex flex-row justify-between bg-white dark:bg-darkGray py-2 px-4" >
          <div className="flex-grow flex flex-col justify-center">
          <div
            className={"font-bold line-clamp-1 overflow-hidden"}
            style={{ fontSize: fontSizeTitle }}
          >
            {title}
          </div>
          <div
            className={"my-auto font-bold line-clamp-2 overflow-hidden text-justify"}
            style={{
              fontSize: fontSizeDescription,
              lineHeight: lineHeightDescription,
            }}
          >
            {description}
          </div>
          <div
            className={"font-bold self-center overflow-hidden"}
            style={{ fontSize: fontSizeDate }}
          >
            {formatEventDate(date)}
            <div className="inline-block w-1 h-1 bg-black dark:bg-white rounded-full my-0 mx-1 align-middle"></div>
            {formatEventTime(date)}
          </div>
          </div>
          <div className="flex items-end p-3">
            <CircleIcon
              circleSize={circleSize}
              iconSize={circleSize/2}
              circleColor="#ff5757"
              iconFileAddress="/icons/right_arrow_white.svg"
            />
          </div>
        </CardBody>
      </Card>
  );
};


export default RectangleEventCard;