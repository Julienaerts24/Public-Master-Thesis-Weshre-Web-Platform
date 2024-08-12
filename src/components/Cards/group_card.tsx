import React, {useState, useEffect, useRef} from "react";
import { Card, CardBody, Image } from "@nextui-org/react";

type GroupCardNoSizeProps = {
  title: string;
  image: string;
  onPress: () => void
  selected: boolean;
}

const GroupCardNoSize: React.FC<GroupCardNoSizeProps> = ({
  title,
  image,
  onPress,
  selected,
}) => {
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

  const fontSizeTitle = Math.round(cardHeight * 0.12);

  return (
      <Card 
        ref={cardRef}
        isPressable={true} 
        className={`shadow-none w-full h-full rounded-[35px] ${selected ? "border-3 border-redWS" : ""}`}
        onPress={onPress}
      >
        <Image
            alt="Card background"
            className={`w-full h-[56.25%] object-cover transform transition-transform duration-300`}
            style={{height: cardWidth * 9 / 16, width: cardWidth}}
            src={image} /*/images/test_image_size.jpg*/
            radius="none"
        />
        <CardBody
          className="w-full h-[7/16] flex flex-col justify-center items-center bg-white dark:bg-darkGray py-2 px-4 bottom-0 left-0"
        >
          <div
            className={`font-bold line-clamp-1 overflow-hidden transform transition-transform duration-300 ${selected ? "text-redWS" : ""}`}
            style={{ fontSize: fontSizeTitle }}
          >
            {title}
          </div>
        </CardBody>

      </Card>
  );
};


export default GroupCardNoSize;
