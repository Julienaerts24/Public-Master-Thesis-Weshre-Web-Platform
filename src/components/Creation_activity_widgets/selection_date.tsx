"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Datepicker from "react-tailwindcss-datepicker";
import HoursInput from "@/components/Inputs/hours_input";
import {dateRangeType, dateRangeTimeType} from '@/type/formType';
import {dateRangeTimeErrorType} from '@/type/formErrorType';

type SelectionDateProps = {
  datesRangeTime: dateRangeTimeType;
  setDatesRangeTime: (value: dateRangeTimeType) => void;
  disableChange?: boolean;
  errors?: dateRangeTimeErrorType
};

const SelectionDate: React.FC<SelectionDateProps> = ({
  datesRangeTime,
  setDatesRangeTime,
  disableChange,
  errors,
}) => {
  const t = useTranslations("SelectionDateActivity");
  const locale = useLocale();

  const handleDateRangeChange = (newDateRange: dateRangeType) => {
    setDatesRangeTime({...datesRangeTime, dateRange: newDateRange});
  };

  const handleStartTimeChange = (newStartTime: string) => {
    setDatesRangeTime({...datesRangeTime, startTime: newStartTime});
  };

  const handleEndTimeChange = (newEndTime: string) => {
    setDatesRangeTime({...datesRangeTime, endTime: newEndTime});
  };

  useEffect(() => {
    if (datesRangeTime.startTime > datesRangeTime.endTime && datesRangeTime.dateRange.startDate == datesRangeTime.dateRange.endDate) {
      const newEndTime = datesRangeTime.startTime;
      setDatesRangeTime({...datesRangeTime, startTime: newEndTime, endTime: newEndTime});
    }
  }, [datesRangeTime]);

  return (
    <div className="flex flex-col w-full items-center p-4 lg:px-0">
      <div className="flex w-full justify-start items-start text-lg lg:text-xl xl:text-2xl font-semibold pb-6">
        {t("title")}
      </div>
      <div className="w-[320px] flex flex-col gap-5">
        <div className="w-[320px] h-full flex flex-col">
          <Datepicker
            value={datesRangeTime.dateRange}
            onChange={handleDateRangeChange as any}
            placeholder={t("choose_date")}
            inputClassName={`w-full p-2 rounded-xl text-black dark:text-white font-normal ${disableChange ? "bg-disableCardColor dark:bg-disableDarkCardColor" : "bg-cardColor dark:bg-darkCardColor"} border-0 focus:border-0 focus:outline-none focus:ring-0 ${errors?.dateRange ? "border-2 border-redError text-redError text-sm" : "p-[10px]"}`}
            toggleClassName="absolute bg-redWS text-white right-0 h-full px-3 rounded-xl"
            i18n={locale}
            useRange={false}
            separator={" - "}
            primaryColor={"red"}
            startWeekOn="mon"
            displayFormat={"DD/MM/YYYY"}
            popoverDirection="down"
            minDate={new Date()}
            readOnly={true}
            disabled={disableChange}
          />
          {errors?.dateRange && (
            <div className="text-redError text-sm font-bold">
              {errors.dateRange?.startDate ? errors.dateRange.startDate : errors.dateRange.endDate}
            </div>
          )}
        </div>
        <div className="flex flex-row gap-5 justify-between">
          <div className="h-fit flex flex-col">
            <HoursInput
              label={t("from")}
              size="150px"
              setValue={handleStartTimeChange}
              value={datesRangeTime.startTime}
              isDisable={disableChange}
              isError={errors?.startTime !== undefined}
            />
            {errors?.startTime && (
              <div className="text-redError text-sm font-bold pb-3">
                {errors.startTime}
              </div>
            )}
          </div>
          <div className="h-fit flex flex-col">
            <HoursInput
              label={t("to")}
              size="150px"
              setValue={handleEndTimeChange}
              value={datesRangeTime.endTime}
              isDisable={disableChange}
              isError={errors?.endTime !== undefined}
            />
            {errors?.endTime && (
              <div className="text-redError text-sm font-bold pb-3">
                {errors.endTime}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionDate;
