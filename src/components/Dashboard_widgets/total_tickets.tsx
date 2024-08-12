import React from "react";
import NumberCard from "@/components/Cards/number_card";
import CardSkeleton from "@/components/Skeletons/card_skeleton";

import {useTranslations} from 'next-intl';

type TotalTicketCardProps = {
  totalTickets: number | undefined;
};

const TotalTicketCard: React.FC<TotalTicketCardProps> = ({ totalTickets }) => {
  const t = useTranslations('MyDashboard');

  if (totalTickets == undefined) return (<CardSkeleton />)

  return (
    <div className="h-full w-full">
      <NumberCard title={t('total_tickets')} number={totalTickets}/>
    </div>
  );
};

export default TotalTicketCard;

