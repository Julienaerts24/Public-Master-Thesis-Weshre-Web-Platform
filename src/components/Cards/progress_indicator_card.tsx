import React, {useState, useEffect, useRef} from "react";
import { Card, CardBody, Progress } from "@nextui-org/react";

type ProgressIndicatorCardProps = {
  size: number;
  title: string;
  currentNumber: number;
  maxNumber: number;
  unit: string;
};

const ProgressIndicatorCard: React.FC<ProgressIndicatorCardProps> = ({
  size,
  title,
  currentNumber,
  maxNumber,
  unit,
}) => {

  const [cardHeight, setCardHeight] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

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

  if (size < 150) size = 150; // Minimal size of 150px
  const percentage = maxNumber == 0 ? 0 : (currentNumber / maxNumber) * 100;
  const sizeTitle = Math.floor(size * 0.13);
  const sizeNumber = Math.floor(size * 0.20);
  const sizeProgressText = Math.floor(size * 0.07);

  return (
    <Card
      ref={cardRef}
      className="w-full h-full cursor-default shadow-none"
      style={{ borderRadius: 35, minHeight: 125 }}
    >
      <CardBody className="flex flex-col justify-around items-center bg-white dark:bg-darkGray py-4 px-4">
        <div
          className={
            "font-medium line-clamp-2 flex justify-center items-center text-center overflow-hidden"
          }
          style={{ height: 2.2 * sizeTitle, fontSize: sizeTitle, lineHeight: 1.1 }}
        >
          {title}
        </div>
        <div
          className={"font-bold line-clamp-1 overflow-hidden"}
          style={{ fontSize: sizeNumber }}
        >
          {currentNumber} {unit}
        </div>
        <div className="flex flex-col w-full justify-center items-center">
          <div className="flex w-11/12 justify-between">
            <span
              className="font-bold"
              style={{ fontSize: sizeProgressText }}
            >{`${percentage.toFixed(0)}%`}</span>
            <span className="font-bold" style={{ fontSize: sizeProgressText }}>
              {maxNumber}
              {unit}
            </span>
          </div>
          <div className="w-11/12">
            <Progress
              aria-label="progress ticket"
              value={currentNumber}
              maxValue={maxNumber}
              classNames={{ indicator: "bg-redWS" }}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProgressIndicatorCard;
