import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

type NumberCardProps = {
  title: string;
  number: number;
};

const NumberCard: React.FC<NumberCardProps> = ({ title, number}) => {
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
  const titleSize = cardWidth / 12
  const minTitleSize = cardWidth / 14;
  const maxTitleSize = cardWidth / 10;

  const numberSize = cardWidth / 5
  const minNumberSize = cardWidth / 5.5
  const maxNumberSize = cardWidth / 4.5
  
  return (
    <Card
      ref={cardRef}
      className="w-full h-full cursor-default shadow-none bg-white dark:bg-darkGray p-2"
      style={{ borderRadius: 35 }}
    >
      <CardBody className="flex flex-col justify-evenly items-center p-0">
        <div className={"flex justify-evenly items-center text-center font-semibold overflow-hidden line-clamp-2"}
          style={{fontSize: `clamp(${minTitleSize}px, ${titleSize}px, ${maxTitleSize}px)`}}>
          {title}
        </div>
        <div
          className={"line-clamp-1 text-center font-extrabold pt-0 overflow-hidden"}
          style={{fontSize: `clamp(${minNumberSize}px, ${numberSize}px, ${maxNumberSize}px)`}}>
          {number}
        </div>
      </CardBody>
    </Card>
  );
};

export default NumberCard;
