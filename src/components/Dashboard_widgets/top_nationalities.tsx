import React from "react";
import CardSkeleton from "@/components/Skeletons/card_skeleton";
import {useTranslations} from 'next-intl';
import TopNationalitiesCard from "@/components/Cards/top_nationalities_card";

type NationalityData = {
  label: string;
  value: number;
};

type TopNationalitiesProps = {
  allNationalities: NationalityData[] | undefined;
};

const TopNationalities: React.FC<TopNationalitiesProps> = ({ allNationalities }) => {
  const t = useTranslations('MyDashboard');

  if (allNationalities == undefined) return <CardSkeleton />

  return (
    <div className="h-full w-full">
      <TopNationalitiesCard title={t('top_nationalities')} nationalities={allNationalities}/>
    </div>
  );
};

export default TopNationalities;