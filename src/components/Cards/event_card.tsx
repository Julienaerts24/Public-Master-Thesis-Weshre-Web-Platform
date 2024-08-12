import React, {useState, useEffect, useRef} from "react";
import { Card, CardBody, Image } from "@nextui-org/react";
import CircleIcon from "@/components//Containers/circle_icon";
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import {formatEventDate, formatEventTime} from "@/utils/formattedDate";

type EventCardNoSizeProps = {
  title: string;
  description: string;
  date: Date;
  image: string;
  displayButton: boolean;
  onPress: () => void
  deletable?: boolean;
  onDelete?: () => void
}

const EventCardNoSize: React.FC<EventCardNoSizeProps> = ({
  title,
  description,
  date,
  image,
  displayButton,
  onPress,
  deletable = false,
  onDelete = () => {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setCardHeight(entry.contentRect.height);
        setCardWidth(entry.contentRect.width);
      }
    });

    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => resizeObserver.disconnect(); // Clean up
  }, []);

  const fontSizeTitle = Math.round(cardHeight * 0.06);
  const fontSizeDescription = Math.max(10, Math.round(cardHeight * 0.040));
  const lineHeightDescription = Math.min(1.7, Math.round(cardHeight * 0.008));
  const fontSizeDate = Math.round(cardHeight * 0.05);
  const circleSize = Math.max(cardHeight * 0.15, 35)

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        ref={cardRef}
        isPressable={true} 
        className="shadow-none w-full h-full rounded-[35px]"
        onPress={onPress}
      >
        <Image
            alt="Card background"
            className={`w-full h-[56.25%] object-cover transform transition-transform duration-300 ${isHovered ? 'scale-[1.08]' : ''}`}
            style={{height: cardHeight * 9 / 16, width: cardWidth}}
            src={image} /*/images/test_image_size.jpg*/
            radius="none"
        />
        <CardBody
          className="w-full h-[7/16] flex flex-col justify-center bg-white dark:bg-darkGray py-2 px-4 bottom-0 left-0"
        >
          <div
            className={`font-bold line-clamp-2 overflow-hidden transform transition-transform duration-300 ${isHovered ? 'scale-[1.00]' : ''}`}
            style={{ fontSize: fontSizeTitle }}
          >
            {title}
          </div>
          <div
            className={`my-auto font-bold line-clamp-2 overflow-hidden transform transition-transform duration-300 ${isHovered ? 'scale-[1.00]' : ''}`}
            style={{
              fontSize: fontSizeDescription,
              lineHeight: lineHeightDescription,
            }}
          >
            {description}
          </div>
          <div
            className={`font-bold self-center overflow-hidden transform transition-transform duration-300 ${isHovered ? 'scale-[1.00]' : ''}`}
            style={{ fontSize: fontSizeDate }}
          >
            {formatEventDate(date)}
            <div className="inline-block w-1 h-1 bg-black dark:bg-white rounded-full my-0 mx-1 align-middle"></div>
            {formatEventTime(date)}
          </div>
          <div className={`absolute right-0 bottom-0 flex items-end p-3 ${displayButton ? '' : 'hidden'}`}>
            <CircleIcon
              circleSize={circleSize}
              iconSize={circleSize/2}
              circleColor="#ff5757"
              iconFileAddress="/icons/right_arrow_white.svg"
            />
          </div>
        </CardBody>
      </Card>
      { deletable &&
        <div aria-label="delete_button" className={`absolute right-0 top-0 z-20 max-md:opacity-100 max-md:visible transition-opacity duration-1000 ${isHovered ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <CircleIconButton
          circleSize={30}
          iconSize={22}
          circleColor="#ff5757"
          iconFileAddress="/icons/cross_white.svg"
          onClick={onDelete}
          responsiveness={10}
        />
      </div>
      }
    </div>
  );
};


export default EventCardNoSize;
