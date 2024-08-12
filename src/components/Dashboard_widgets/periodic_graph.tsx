import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu} from "@nextui-org/react";
import { useTranslations } from 'next-intl';
import VerticalProgressBar from "@/components/Progress/vertical_progress_bar";
import DropDownButton from "@/components/Buttons/drop_down_button";
import CardSkeleton from "@/components/Skeletons/card_skeleton";

type DataYear = {
  year: number;
  datas: DataItem[];
};

type DataItem = {
  value: number;
  label: string;
};

type PeriodicGraphCardProps = {
  dataYears: DataYear[] | undefined;
};

const PeriodicGraphCard: React.FC<PeriodicGraphCardProps> = ({ dataYears }) => {
  const t = useTranslations('MyDashboard');
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(0);
  const [dataList, setDataList] = useState<DataItem[]>([]);
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getUTCFullYear());

  useEffect(() => {
    const changeSelectedDate = () => {
      if (dataYears) {
        const selectedDataYear = dataYears.find(dataYear => dataYear.year === selectedYear);
        if (selectedDataYear) {
          setDataList(selectedDataYear.datas);
        }
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setCardHeight(entry.contentRect.height);
      }
    });
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }
    changeSelectedDate();
    return () => resizeObserver.disconnect();
  }, [selectedYear, dataYears]);

  const maxValue = dataList.length > 0 ? Math.max(...dataList.map(item => item.value), 10) : 0;

  if (dataYears == undefined) return (<CardSkeleton />)

  return (
    <Card
    ref={cardRef}
    className="w-full h-full cursor-default shadow-none"
    style={{ borderRadius: 35 }}
  >
    <CardBody className="w-full flex flex-col justify-between items-center bg-white dark:bg-darkGray py-4 overflow-hidden">
      <div className="w-full flex flex-row justify-between items-center shrink-0">
        <div className="px-4 text-xl md:text-3xl font-semibold">
          {t('title_graph')}
        </div>
        <Dropdown type="menu" className="dark:bg-darkGray">
          <div className="h-full">
            <DropDownButton value={selectedYear}/>
          </div>
          <DropdownMenu aria-label="yearMenu">
            {dataYears!.map(({ year }) => (
              <DropdownItem key={year} onPress={() => setSelectedYear(year)}>
                <div className="text-center font-semibold text-xl">
                  {year}
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="w-full h-full flex flex-row justify-evenly items-end overflow-hidden shrink-1">
        {dataList.map((item) => (
            <VerticalProgressBar
              key={item.label}
              currentValue={item.value}
              maxValue={maxValue}
              label={t(item.label)}
              height={cardHeight - 116}
              unit={"€"}
            />
          ))}
      </div>
    </CardBody> 
  </Card>
  );
};

export default PeriodicGraphCard;
