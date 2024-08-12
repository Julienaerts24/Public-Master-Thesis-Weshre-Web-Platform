import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardFooter} from "@nextui-org/react";
import { FaRegAddressCard } from "react-icons/fa6";

type NumberCardProps = {
  title: string;
  number: number;
  footer: string;
};

const NumberCard: React.FC<NumberCardProps> = ({ title, number, footer}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setCardWidth(entry.contentRect.width);
        setCardHeight(entry.contentRect.height);
      }
    });

    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => resizeObserver.disconnect(); // Clean up
  }, []);
  const titleSize = 10 + cardWidth / 40
  const minTitleSize = 10 + cardWidth / 50;
  const maxTitleSize = 10 + cardWidth / 30;

  const numberSize = cardHeight < 180 ? 15 + cardWidth / 16 : 12 + cardWidth / 10;
  const minNumberSize = cardHeight < 180 ? 15 + cardWidth / 20 : 12 + cardWidth / 12;
  const maxNumberSize = cardHeight < 180 ? 15 + cardWidth / 12 : 12 + cardWidth / 8;

  const footerSize = 8 + cardWidth / 60
  const minFooterSize = 8 + cardWidth / 72;
  const maxFooterSize = 8 + cardWidth / 48;

  const iconSize = numberSize + footerSize
  const minIconSize = minNumberSize +  minFooterSize
  const maxIconSize = maxNumberSize + maxFooterSize
  
  return (
    <Card
      ref={cardRef}
      className="w-full h-full cursor-default shadow-none bg-white dark:bg-darkGray p-2"
      style={{ borderRadius: 35 }}
    >
      <CardBody className={`flex flex-col justify-center items-start py-1 ${cardWidth > 180 ? "px-4" : "px-2"}`}>
        <div className={"font-semibold overflow-hidden line-clamp-2"}
          style={{fontSize: `clamp(${minTitleSize}px, ${titleSize}px, ${maxTitleSize}px)`}}>
          {title}
        </div>
        <div className="w-full flex-grow flex flex-row justify-between items-center">   
            <div
            className={"line-clamp-1 text-center font-extrabold pt-0 overflow-hidden"}
            style={{fontSize: `clamp(${minNumberSize}px, ${numberSize}px, ${maxNumberSize}px)`}}>
            {number}
            </div>
            <div
            style={{fontSize: `clamp(${minIconSize}px, ${iconSize}px, ${maxIconSize}px)`}}>
                <FaRegAddressCard />
            </div>
        </div>
        <div className={"flex justify-start items-center overflow-hidden line-clamp-2"}
          style={{fontSize: `clamp(${minFooterSize}px, ${footerSize}px, ${maxFooterSize}px)`}}>
            {footer}
        </div>
      </CardBody>
    </Card>
  );
};

export default NumberCard;

