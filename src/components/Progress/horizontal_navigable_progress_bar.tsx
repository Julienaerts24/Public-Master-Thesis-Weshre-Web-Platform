import React from "react";
import { Progress } from "@nextui-org/react";
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import RedRoundedButton from "@/components/Buttons/rounded_button";

type HorizontalNavigableProgressBarProps = {
  currentIndex: number;
  maxValue: number;
  setIndex: (index: React.SetStateAction<number>) => void;
  onNext: () => void;
  onPrevious: () => void;
  leftToolTipMessage: string;
  rightToolTipMessage: string;
  finalMessage?: string;
  showCheckPoint: boolean;
  clickableCheckPoint: boolean;
};

const HorizontalNavigableProgressBar: React.FC<
  HorizontalNavigableProgressBarProps
> = ({
  currentIndex,
  maxValue,
  setIndex,
  onNext,
  onPrevious,
  leftToolTipMessage,
  rightToolTipMessage,
  finalMessage,
  showCheckPoint,
  clickableCheckPoint,
}) => {
  const goToNext = () => {
    onNext();
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      onPrevious();
      setIndex(currentIndex - 1);
    }
  };

  // Function to render all circles along the progress bar
  const renderCircles = () => {
    const circles = [];
    for (let i = 0; i < maxValue; i++) {
      const positionPercentage = (i / (maxValue - 1)) * 100;
      const isActive = i <= currentIndex;

      circles.push(
        <div
          key={i}
          onClick={() => {
            if (currentIndex > i || clickableCheckPoint) {
                setIndex(i);
                onPrevious();
            }
        }}
          style={{
            left: `${positionPercentage}%`,
            transform: "translateX(-50%)",
            bottom: "-10px",
          }}
          className={`absolute w-8 h-8 flex items-center justify-center rounded-full font-bold select-none transition-colors duration-1000 ${(currentIndex > i || clickableCheckPoint) ? "cursor-pointer" : "cursor-default"} ${
            isActive
              ? "bg-redWS text-white"
              : "bg-white dark:bg-darkGray text-redWS"
          }`}
        >
          {i + 1}
        </div>
      );
    }
    return circles;
  };

  return (
    <div className="w-full h-full flex flex-row justify-start items-center p-5">
      <div className="flex-shrink-0 pr-7">
        <CircleIconButton
          circleSize={50}
          iconSize={25}
          circleColor="#ff5757"
          iconFileAddress="/icons/left_arrow_white.svg"
          onClick={goToPrev}
          messageToolTip={leftToolTipMessage}
          placementToolTip="top"
          sizeMessage={20}
          isDisabled={currentIndex == 0}
        />
      </div>
      <div className="w-full">
        <div className="relative bg-white dark:bg-darkGray rounded-full overflow-visible">
          <Progress
            aria-label="progress form"
            value={currentIndex}
            maxValue={maxValue - 1}
            classNames={{
              indicator: "bg-redWS",
              track: "bg-white dark:bg-darkGray",
            }}
          />
          {showCheckPoint && renderCircles()}
        </div>
      </div>
      <div aria-label="next-page-button" className="flex-shrink-0 pl-7">
        { currentIndex == (maxValue - 1) && finalMessage !== undefined ?
          <RedRoundedButton
            text={finalMessage!}
            sizeText={18}
            onClick={goToNext}
            size="md"
          /> : 
          <CircleIconButton
            
            circleSize={50}
            iconSize={25}
            circleColor="#ff5757"
            iconFileAddress="/icons/right_arrow_white.svg"
            onClick={goToNext}
            messageToolTip={rightToolTipMessage}
            placementToolTip="top"
            sizeMessage={20}
          />
        }
      </div>
    </div>
  );
};

export default HorizontalNavigableProgressBar;
