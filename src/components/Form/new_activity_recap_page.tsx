import {useTranslations} from 'next-intl';
import {createEventsubmittedFormValuesAtom} from "@/atoms/atoms_events";
import React from 'react';
import { useAtomValue } from "jotai";
import EventCard from "@/components/Cards/event_card";
import {imagesType, dateRangeTimeType} from '@/type/formType';
import CircleTextContainer from "@/components/Containers/icon_text_container"
const NewActivityRecapPage = () => {
  const submittedFormValues = useAtomValue(createEventsubmittedFormValuesAtom);
  const t = useTranslations("NewActivityRecapPage");

  const photos = submittedFormValues.activityPhotos as imagesType;
  const image = (photos !== null && photos !== undefined && photos.cover !== null && photos.cover !== undefined) ? photos.cover as string : ""

  const date_day = submittedFormValues.activityDate as dateRangeTimeType;
  const date = (date_day !== null && date_day !== undefined && date_day.dateRange !== null && date_day.dateRange !== undefined) ? new Date(`${date_day.dateRange.startDate}T${date_day.startTime}:00.000Z`) : new Date();

  return (
    <div className="w-full h-full flex flex-col shrink-0">
        <div className="text-xl lg:text-2xl xl:text-3xl font-bold pb-1 sm:pb-4 shrink-0">
          {t("title")}
        </div>
        <div className='w-full h-full flex flex-col sm:flex-row sm:justify-between sm:items-start'>
          <div className='w-[320px] h-[320px] sm:mr-10 sm:mt-6 shrink-0'>
            <EventCard
              title={submittedFormValues.informationTitle as string}
              description={submittedFormValues.informationDescription as string}
              date={date}
              image={image}
              displayButton={false}
              onPress={() => {}}
            />
          </div>
          <div className='h-full flex-grow flex flex-col pt-6'>
            <div className="text-xl lg:text-2xl xl:text-3xl font-bold pb-1 sm:pb-4 shrink-0">
              {t("what_next")}
            </div>
            <div className='py-2 sm:py-3'>
              <CircleTextContainer text={t("prepare")} sizeIcon={50} icon="/icons/newActivity/recap/check_list.svg" responsiveness={20}/>
            </div>
            <div className='py-2 sm:py-3'>
              <CircleTextContainer text={t("manage")} sizeIcon={50} icon="/icons/newActivity/recap/feed.svg" responsiveness={20}/>
            </div>
            <div className='py-2 sm:py-3'>
              <CircleTextContainer text={t("enjoy")} sizeIcon={50} icon="/icons/newActivity/recap/party.svg" responsiveness={20}/>
            </div>
          </div>
        </div>
    </div>
  );
};

export default NewActivityRecapPage;