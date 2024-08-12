'use client'

import ChoicesButton from "@/components/Buttons/choice_button";
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import GroupEventCards from "@/components/Cards/group_event_cards";
import React from "react";
import {useTranslations} from 'next-intl';
import { useAtom } from "jotai";
import { ComingPastChoiceAtom, sortChoiceAtom, researchEventAtom } from "@/atoms/atoms_events";
import SortButton from "@/components/Buttons/sort_button";
import ResearchInput from "@/components/Inputs/search_input";
import { useRouter } from "next/navigation";

export default function MyActivities() {
  const t = useTranslations('MyActivities');
  const router = useRouter();
  const [selectedChoice, setSelectedChoice] = useAtom(ComingPastChoiceAtom);
  const [selectedSort, setSelectedSort] = useAtom(sortChoiceAtom);
  const [search, setSearch] = useAtom(researchEventAtom);

  return (
    <div className="flex flex-col h-full">
      <div className="h-[190px] sm:h-[130px] flex flex-col justify-between mx-5">
        <div className="flex flex-row justify-between items-center h-[40px] sm:h-[80px] w-full ">
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {t('page_title')}
          </div>
          <CircleIconButton
            circleSize={60}
            iconSize={40}
            sizeMessage={22}
            sizePaddingMessage={13}
            circleColor="#ff5757"
            messageToolTip={t('tip_creation')}
            iconFileAddress="/icons/plus_white.svg"
            onClick={() => router.push("/myActivities/newActivity")}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-[100px] sm:h-[50px] w-full">
          <div className="w-full">
            <ChoicesButton
                selectedChoice={selectedChoice}
                setSelectedChoice={(choice : string) => setSelectedChoice(choice)}
                choicesList={['coming', 'past', 'draft']}
              />
          </div>
          <div className="h-[50px] sm:h-[48px] sm:pt-0 flex flex-row justify-end items-center w-full">
            <div className="w-full max-w-lg h-[48px] flex-shrink-1 pr-5 rounded-2xl">
              <ResearchInput
                search={search}
                setSearch={setSearch}
                size="sm"
              />
            </div>
            <div key={"sort_button"} aria-label="sort_button">
              <SortButton selectedChoice={selectedSort} setSelectedChoice={setSelectedSort}/>
            </div>
          </div>
        </div>
      </div>
      <GroupEventCards/>
    </div>
  );
}
