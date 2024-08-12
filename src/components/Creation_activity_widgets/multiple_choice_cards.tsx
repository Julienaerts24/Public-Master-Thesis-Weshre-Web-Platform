"use client";

import React, { useState, useEffect } from "react";
import IconTitleCard from "@/components/Cards/icon_title_card";
import { useTheme } from "next-themes";
import {choicesType} from '@/type/formType';

type MultipleChoiceCardsProps = {
  title?: string;
  description?: string;
  choices?: choicesType[];
  selected: string[];
  setSelected: (value: string[]) => void;
  multipleSelection?: Boolean;
  minWidth?: number;
  minHeight?: number;
  disableChange?: boolean;
  errors?: string
};

const MultipleChoiceCards: React.FC<MultipleChoiceCardsProps> = ({
  title = " ",
  description = " ",
  choices = [],
  selected,
  setSelected,
  multipleSelection = false,
  minWidth = 150,
  minHeight,
  disableChange = false,
  errors,
}) => {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || (!theme && resolvedTheme === "dark");
  const [widthAvailable, setWidthAvailable] = useState<number>(window.innerWidth > 1024 ? (window.innerWidth - 88) * 0.7 - 18 : window.innerWidth > 640 ? (window.innerWidth - 88 - 24) - 18 : window.innerWidth - 24 - 18);

  useEffect(() => {
    const handleResize = () => {
      setWidthAvailable(window.innerWidth > 1024 ? (window.innerWidth - 88) * 0.7 - 18: window.innerWidth > 640 ? (window.innerWidth - 88 - 24) - 18 : window.innerWidth - 24 - 18);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelection = (key: string) => {
    if (multipleSelection) {
      if (selected.includes(key)) {
        setSelected(selected.filter(item => item !== key));
      } else {
        setSelected([...selected, key]);
      }
    } else {
      setSelected([key]);
    }
  };

  const numberPossibleOneRow = Math.floor((widthAvailable + 16) / (minWidth + 16));
  const widthCard = Math.floor(((widthAvailable - ((numberPossibleOneRow - 1) * 16)) / numberPossibleOneRow))
  const shouldWrap = choices.length > numberPossibleOneRow;

  return (
    <div className="w-full flex flex-col items-center">
      <div className={`flex w-full justify-start items-start text-lg lg:text-xl xl:text-2xl font-semibold pb-1 sm:pb-2 ${errors ? "" : ""}`}>
          {title}
      </div>
      <div className={`flex w-full justify-start items-start text-sm lg:text-lg xl:text-xl font-light pb-1 sm:pb-4 ${errors ? "" : ""}`}>
          {description}
      </div>
      <div className={`flex flex-row ${shouldWrap ? "flex-wrap justify-start" : "justify-evenly"} h-full w-full gap-4`}>
        {choices.map((choice, index) => (
          <IconTitleCard
            key={choice.key}
            title={choice.title}
            image={choice.icon && choice.icon !== "" ? (selected !== undefined && selected.includes(choice.key) ? choice.icon.replace(".svg", "_selected.svg") : isDark ? choice.icon.replace(".svg", "_dark.svg") : choice.icon) : undefined}
            minHeightCard={minHeight ? minHeight : choice.icon && choice.icon !== "" ? 150 : 50}
            widthCard={widthCard}
            sizeImage={widthCard / 3}
            sizeText={20}
            selected={selected !== undefined && selected.includes(choice.key)}
            onPress={() => handleSelection(choice.key)}
            disable={disableChange}
          />
        ))}
      </div>
      {errors && <div className="text-redError text-sm font-bold text-justify px-5 pt-5">{errors}</div>}
    </div>
  );
};

export default MultipleChoiceCards;

