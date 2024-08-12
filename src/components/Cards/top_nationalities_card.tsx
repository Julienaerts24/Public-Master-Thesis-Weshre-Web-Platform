import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import ProgressCircleLabeled from "@/components/Progress/progress_circle_labeled";
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import { useTranslations } from "next-intl";

type NationalityData = {
  label: string;
  value: number;
};

type TopNationalitiesCardProps = {
  title: string;
  nationalities: NationalityData[];
};

const TopNationalitiesCard: React.FC<TopNationalitiesCardProps> = ({
  title,
  nationalities,
}) => {
  const t = useTranslations("MyDashboard");
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  
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

  useEffect(() => {
    const itemWidth = Math.min(cardHeight - 40 - 16 - 36, cardWidth / 5 - 20) + 30;
    const arrowWidth = Math.max(Math.min(cardHeight - 40 - 16 - 36, cardWidth / 5 - 20), 40) * 0.6;
    const visibleItems = Math.floor((cardWidth - 2 * arrowWidth) / itemWidth);
    const newItemsPerPage = visibleItems > 0 ? visibleItems : 1;
    if(itemsPerPage != newItemsPerPage) {setCurrentIndex(0)} // handle mini bug when we are at the end of the list (index = high) and the itemsPerPage increase => index become bigger that max newindex
    setItemsPerPage(newItemsPerPage);
  }, [cardWidth, cardHeight]);

  const goToNext = () => {
    const maxIndex = nationalities.length - itemsPerPage;
    setCurrentIndex((currentIndex) => {
      const newIndex = currentIndex + itemsPerPage;
      return newIndex < maxIndex ? newIndex : maxIndex; // Ensure we don't go beyond the max index
    });
  };
  
  const goToPrev = () => {
    setCurrentIndex((currentIndex) => {
      const newIndex = currentIndex - itemsPerPage;
      return newIndex > 0 ? newIndex : 0; // Ensure we don't go below 0
    });
  };

  const titleSize = Math.min(cardWidth / 12, 28);
  const topNationalities = nationalities.sort((a, b) => b.value - a.value);
  const startIndex = currentIndex;
  const visibleNationalities = topNationalities.slice(startIndex, startIndex + itemsPerPage);
  const itemSize = Math.min(cardHeight - 40 - 16 - 36, cardWidth / 5 - 20);
  const arrowSize = Math.max(itemSize * 0.6, 40)
  return (
    <Card
      ref={cardRef}
      className="w-full h-full cursor-default shadow-none bg-white dark:bg-darkGray p-2"
      style={{ borderRadius: 35 }}
    >
      <CardHeader
        className="h-fit min-h-[50px] flex justify-start items-center font-semibold overflow-hidden line-clamp-1 px-3 py-0"
        style={{ fontSize: `${titleSize}px` }}
      >
        {title}
      </CardHeader>
      <CardBody className="w-full h-full">
      { nationalities.length !== 0 ? (
        <div className="w-full h-full flex flex-row justify-between items-center p-0">
          <CircleIconButton
          isDisabled={currentIndex <= 0}
          circleSize={arrowSize}
          iconSize={arrowSize / 2}
          circleColor="#ff5757"
          iconFileAddress="/icons/left_arrow_white.svg"
          onClick={goToPrev}
        />
          <div className="flex flex-row flex-grow justify-evenly items-center p-0">
            {visibleNationalities.map((nationality) => (
              <ProgressCircleLabeled
                key={nationality.label}
                value={nationality.value}
                label={nationality.label}
                size={itemSize}
              />
            ))}
          </div>
        <CircleIconButton
          isDisabled={currentIndex >= nationalities.length - itemsPerPage}
          circleSize={arrowSize}
          iconSize={arrowSize / 2}
          circleColor="#ff5757"
          iconFileAddress="/icons/right_arrow_white.svg"
          onClick={goToNext}
        />
        </div>) : 
        <div className="w-full h-full flex items-center justify-center text-center font-bold text-lg p-2">
          {t("no_nationalities")}
        </div>
        }
      </CardBody>
    </Card>
  );
};

export default TopNationalitiesCard;

