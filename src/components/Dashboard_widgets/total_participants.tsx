import React from "react";
import NumberCard from "@/components/Cards/number_card";
import CardSkeleton from "@/components/Skeletons/card_skeleton";
import ErrorBoundary from "@/components/Errors/error_boundary_card";
import { useTranslations } from 'next-intl';

type TotalParticipantsCardProps = {
  totalParticipants: number | undefined;
};

const TotalParticipantsCard: React.FC<TotalParticipantsCardProps> = ({ totalParticipants }) => {
  const t = useTranslations('MyDashboard');

  if (totalParticipants === undefined) return (<CardSkeleton />);

  return (
    <ErrorBoundary>
      <div className="h-full w-full">
        <NumberCard title={t('total_participants')} number={totalParticipants} />
      </div>
    </ErrorBoundary>
  );
};

export default TotalParticipantsCard;
