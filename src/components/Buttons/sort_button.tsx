'use client'
import React, { useState } from 'react';
import {useTranslations} from 'next-intl';
import {Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger} from "@nextui-org/react";
import { TbSortAZ } from "react-icons/tb";
import { TbSortZA } from "react-icons/tb";
import { TbSort09 } from "react-icons/tb";
import { TbSort90 } from "react-icons/tb";

type SortButtonProps = {
  selectedChoice: string;
  setSelectedChoice: (choice: string) => void;
}

const SortButton: React.FC<SortButtonProps> = ({
  selectedChoice,
  setSelectedChoice,
}) => {
  const t = useTranslations('sortDropDown');

  const getSortIcon = (sortType: string) => {
    switch (sortType) {
      case 'AZ':
        return <TbSortAZ />;
      case 'ZA':
        return <TbSortZA />;
      case '09':
        return <TbSort09 />;
      case '90':
        return <TbSort90 />;
      default:
        return null; // Or a default icon if you have one
    }
  };
  return (
    <Dropdown aria-label='sort_dropdown' className='bg-lightBackground dark:bg-darkGray'>
          <DropdownTrigger>
            <div className='flex rounded-xl bg-redWS text-white justify-center items-center text-4xl cursor-pointer'> {getSortIcon(selectedChoice)}</div>
          </DropdownTrigger>
          <DropdownMenu aria-label="settingMenu">
            <DropdownSection title={t('sortBy')} className="font-bold">
              <DropdownItem
                key="09"
                startContent={<TbSort09 className="text-[25px] p-[1%]" />}
                onPress={() => {setSelectedChoice('09')}}
              >
                {t('09')}
              </DropdownItem>
              <DropdownItem
                key="90"
                startContent={<TbSort90 className="text-[25px] p-[1%]" />}
                onPress={() => {setSelectedChoice('90')}}
              >
                {t('90')}
              </DropdownItem>
              <DropdownItem
                key="AZ"
                startContent={<TbSortAZ className="text-[25px] p-[1%]" />}
                onPress={() => {setSelectedChoice('AZ')}}
              >
                {t('AZ')}
              </DropdownItem>
              <DropdownItem
                key="ZA"
                startContent={<TbSortZA className="text-[25px] p-[1%]" />}
                onPress={() => {setSelectedChoice('ZA')}}
              >
                {t('ZA')}
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
  );
};

export default SortButton;
