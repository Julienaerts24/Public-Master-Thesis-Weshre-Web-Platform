'use client'

import { Button, Select, SelectItem} from "@nextui-org/react";
import React, {useState, useEffect} from "react";
import {useTranslations} from 'next-intl';

type ChoicesButtonProps = {
  selectedChoice: string;
  setSelectedChoice: (choice: string) => void;
  choicesList: string[];
}

const ChoicesButton: React.FC<ChoicesButtonProps> = ({
  selectedChoice,
  setSelectedChoice,
  choicesList,
}) => {
  const t = useTranslations('MyActivities');
  const [isLargerThanSm, setIsLargerThanSm] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargerThanSm(window.innerWidth >= 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChoice(e.target.value)
  };

  return (
    <>
      {isLargerThanSm ? (
        <div className="flex flex-row justify-evenly items-center h-[40px] sm:h-[50px] w-full sm:w-1/2">
          {choicesList.map((choice) => (
            <Button
              key={choice}
              className={`${
                selectedChoice === choice
                  ? "bg-transparent border-b-4 border-redWS text-sm lg:text-xl xl:text-2xl font-bold"
                  : "bg-transparent font-medium text-sm lg:text-lg xl:text-xl hover:text-base lg:hover:text-xl xl:hover:text-2xl"
                } max-w-1/2 w-5/12 h-full`}
              onClick={() => setSelectedChoice(choice)}
              radius="none"
              size="lg"
            >
              {t(choice)}
            </Button>
          ))}
        </div>
      ) : (
        <div className="py-2">
          <Select
            aria-label="choices"
            label={t('category_title')}
            onChange={handleSelectionChange}
            selectedKeys={[selectedChoice]}
            size="sm"
            disallowEmptySelection
            classNames={{
              base: "text-sm lg:text-xl xl:text-2xl font-bold",
              value: "text-black dark:text-white text-sm lg:text-lg xl:text-xl font-bold",
              trigger: `bg-default/50 dark:bg-default/50`,
            }}
          >
            {choicesList.map((choice) => (
              <SelectItem key={choice} value={choice}>
                {t(choice)}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
    </>
  );
};

export default ChoicesButton;

