import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import {useTranslations} from 'next-intl';
import {DataType} from "@/type/dashboardType";

type NumberCardGraphProps = {
  title: string;
  number: number;
  tickets: DataType[];
  startDate: Date;
  period: "All" | "1 Year" | "6 Months" | "30 Days" | "7 Days" | "24 Hours";
};

const NumberCardGraph: React.FC<NumberCardGraphProps> = ({ title, number, tickets, startDate, period}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [activeSection, setActiveSection] = useState<null | string>();
  const [activeIndex, setActiveIndex] = useState<null | number>();
  const t = useTranslations("MyDashboard");

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setCardWidth(entry.contentRect.width);
      }
    });

    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const titleSize = cardWidth / 25
  const minTitleSize = cardWidth / 30;
  const maxTitleSize = cardWidth / 20;

  const numberSize = cardWidth / 15
  const minNumberSize = cardWidth / 18
  const maxNumberSize = cardWidth / 12
  const unit = "€"
  const ticketsData: number[] = tickets.map(item => item.data);
  const ticketsDate: string[] = tickets.map(item => item.date);
  const startDateAxis = ticketsDate[0];
  const endDateAxis = ticketsDate[ticketsDate.length - 1];
  let middleDate = new Date();
  let middleDateAxis;
  const monthNames = [t("Jan"), t("Feb"), t("Mar"), t("Apr"), t("May"), t("Jun"), t("Jul"), t("Aug"), t("Sep"), t("Oct"), t("Nov"), t("Dec")];
  switch(period) {
      case "All":
        const now = new Date();
        const difference = now.getTime() - startDate.getTime();
        middleDate = new Date(startDate.getTime() + difference / 2);
        middleDateAxis = `${monthNames[middleDate.getUTCMonth()]} ${middleDate.getUTCFullYear()}`;
        break;
      case "1 Year":
        middleDate.setMonth(middleDate.getUTCMonth() - 6);
        middleDateAxis = `${monthNames[middleDate.getUTCMonth()]} ${middleDate.getUTCFullYear()}`;
        break;
      case "6 Months":
        middleDate.setMonth(middleDate.getUTCMonth() - 3);
        middleDateAxis = `${monthNames[middleDate.getUTCMonth()]} ${middleDate.getUTCFullYear()}`;
        break;
      case "30 Days":
        middleDate.setDate(middleDate.getUTCDate() - 15);
        middleDateAxis =`${middleDate.getUTCDate()} ${monthNames[middleDate.getUTCMonth()]}`;
        break;
      case "7 Days":
        middleDate.setDate(middleDate.getUTCDate() - 3);
        middleDateAxis = `${middleDate.getUTCDate()} ${monthNames[middleDate.getUTCMonth()]}`;
        break;
      case "24 Hours":
        middleDate.setHours(middleDate.getUTCHours() - 12);
        middleDateAxis = `${middleDate.getUTCHours()}:00`;
        break;
    }

  const sections = Array.from({ length: ticketsDate.length }, (_, index) => (
    <div 
      key={index} 
      className="flex justify-center"
      style={{ 
        flex: 1, 
        height: '100%', 
      }} 
      onMouseEnter={() => {
        setActiveIndex(index);
        setActiveSection(ticketsDate[index])
      }} 
      onMouseLeave={() => {
        setActiveSection(null);
        setActiveIndex(null);
      }}
      >
        <div className={`${index === activeIndex ? "absolute h-full ml-[2px] w-0 border-r-4 border-black border-dashed opacity-40" : ''}`} />
      </div>
  ));

  return (
    <Card
      ref={cardRef}
      className="w-full h-full cursor-default shadow-none bg-white dark:bg-darkGray p-2 overflow-hidden"
      style={{ borderRadius: 35 }}
    >
      <CardBody className="flex flex-row justify-evenly items-center overflow-hidden">
        <div className="w-5/12 h-full flex flex-col justify-center items-center p-0">
            <div className={"w-full flex justify-evenly items-center text-center font-semibold overflow-hidden line-clamp-2"}
              style={{fontSize: `clamp(${minTitleSize}px, ${titleSize}px, ${maxTitleSize}px)`}}>
              {title}
            </div>
            <div className={"w-full line-clamp-1 text-center font-extrabold pt-0 overflow-hidden"}
              style={{fontSize: `clamp(${minNumberSize}px, ${numberSize}px, ${maxNumberSize}px)`}}>
              {parseFloat(number.toFixed(2))} {unit}
            </div>
        </div>
        <div className="w-7/12 h-full flex justify-center items-end pb-4">
          <div className="relative" style={{ width: "100%", height: "100%" }}>
            <div className="absolute inset-0 flex">
              {sections}
            </div>
            <div className="flex w-full h-full justify-center">
            <Sparklines data={ticketsData} style={{ width: `${Math.ceil(100-(100/ticketsDate.length))}%`, height: "100%" }}>
              <SparklinesLine style={{ fill: "none", strokeWidth: 3}} color="#ff5757" />
            </Sparklines>
            </div>
            {(activeSection !== null && activeSection !== undefined)  ? (
              <div className="text-center text-xs md:text-sm font-extrabold">
                {activeSection}
              </div>
            ) :
            (startDate !== undefined && middleDateAxis !== undefined && endDateAxis !== undefined)  ? (
              <div className="flex flex-row w-full justify-between">
                <div className="w-full text-start text-xs md:text-sm font-extrabold transform -translate-x-1/4 overflow-hidden">
                  {startDateAxis}
                </div>
                <div className="w-full text-center text-xs md:text-sm font-extrabold overflow-hidden">
                  {middleDateAxis}
                </div>
                <div className="w-full text-end text-xs md:text-sm font-extrabold overflow-hidden">
                  {endDateAxis}
                </div>
              </div>
            ) :
              " "
          }
          </div>
          {(activeSection !== null && activeSection !== undefined && ticketsData !== undefined) && (
            <div className="absolute top-2 right-2 bg-redWS text-white px-2 py-1 text-xs md:text-base rounded overflow-hidden">
              {parseFloat(ticketsData![activeIndex!].toFixed(2))} {unit}
            </div>
            )}
        </div>
      </CardBody>
    </Card>
  );
};

export default NumberCardGraph;
