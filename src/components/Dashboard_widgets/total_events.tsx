import React from "react";
import NumberCard from "@/components/Cards/number_card";
import CardSkeleton from "@/components/Skeletons/card_skeleton";
import {useTranslations} from 'next-intl';

type TotalEventsCardProps = {
  totalEvents: number | undefined;
};

const TotalEventsCard: React.FC<TotalEventsCardProps> = ({ totalEvents }) => {
  const t = useTranslations('MyDashboard');

  if (totalEvents == undefined) return (<CardSkeleton />)

  return (
    <div className="h-full w-full">
      <NumberCard title={t('total_events')} number={totalEvents}/>
    </div>
  );
};

export default TotalEventsCard;

