import React from "react";
import RedRoundedButton from "@/components/Buttons/rounded_button";
import ChoiceCard from "@/components/Cards/choice_card";
import {useTranslations} from 'next-intl';
import {choiceCardType} from '@/type/formType';
import {choiceCardErrorType, choiceCardsErrorType} from '@/type/formErrorType';

type AddableChoicesProps = {
  titleAdd?: string;
  titleName?: string;
  titleDescription?: string;
  titleNumber?: string;
  choices: choiceCardType[];
  setChoices: (value: choiceCardType[]) => void;
  initialName?: string;
  initialDescription?: string;
  initialValue?: number;
  minValue?: number;
  maxValue?: number;
  maxNbrChoice?: number;
  maxLengthName?: number;
  maxLengthDescription?: number;
  disableChange?: boolean;
  errors?: choiceCardsErrorType | string;
};

const AddableChoices: React.FC<AddableChoicesProps> = ({
  titleAdd,
  titleName,
  titleDescription,
  titleNumber,
  choices,
  setChoices,
  initialName = "",
  initialDescription = "",
  initialValue = 0,
  minValue = 0,
  maxValue = Number.MAX_VALUE,
  maxNbrChoice = Number.MAX_VALUE,
  maxLengthName = 50,
  maxLengthDescription = 200,
  disableChange,
  errors,
}) => {
    const t = useTranslations('AddableChoice');
    initialName = initialName || "";

    const addChoicesCard = () => {
      if (choices.length < maxNbrChoice){
        const nextId = choices.length > 0 ? choices[choices.length - 1].id + 1 : 1;
        setChoices([...choices, { id: nextId, name: `${initialName}${initialName != "" ? " "+nextId : ""}`, description: `${initialDescription}`, number: initialValue }]);
      }
    };

    const updateChoicesCard = (updatedChoice: choiceCardType) => {
      setChoices(choices.map(choice => choice.id === updatedChoice.id ? updatedChoice : choice));
    };

    const deleteChoicesCard = (id: number) => {
      setChoices(choices.filter(choice => choice.id !== id));
    };
      return (
        <div className="w-full flex flex-col pb-4 md:pb-6">
          <div className="self-end">
            <RedRoundedButton
              text={titleAdd || t("add")}
              sizeText={16}
              onClick={addChoicesCard}
              disabled={choices.length >= maxNbrChoice}
              size="md"
              icon="/icons/plus_white.svg"
            />
          </div>
          { choices.length != 0 &&
          <div className="bg-white dark:bg-darkGray my-2 py-4 px-5 rounded-3xl flex-grow flex flex-row justify-between items-center mx-4 md:mx-8">
            <div className={`w-full sm:w-5/12 text-start text-lg lg:text-xl xl:text-2xl font-semibold select-none ${errors ? "text-redError" : ""}`}>
              {titleName || t("add")}
            </div>
            <div className={`w-0 max-sm:hidden sm:w-7/12 text-start text-lg lg:text-xl xl:text-2xl font-semibold select-none ${errors ? "text-redError" : ""}`}>
              {titleDescription || t("description")}
            </div>
            <div className={`flex-shrink-0 w-[112px] md:w-[176px] xl:w-[190px] text-lg lg:text-xl xl:text-2xl font-semibold text-center select-none ${errors ? "text-redError" : ""}`}>
              {titleNumber || t("number")}
            </div>
          </div>
          }
          {errors && typeof errors === 'string' && <div className="text-redError text-sm font-bold text-center px-2 py-1">{errors}</div>}
          {choices.map((choicesCard, index) => (
            <div key={choicesCard.id} className="flex-grow mx-4 md:mx-8">
              <ChoiceCard
                key={choicesCard.id}
                choice={choicesCard}
                setChoice={updateChoicesCard}
                minValue={minValue}
                maxValue={maxValue}
                maxLengthName={maxLengthName}
                maxLengthDescription={maxLengthDescription}
                descriptionTitle={titleDescription || t("description")}
                deleteChoice={() => deleteChoicesCard(choicesCard.id)}
                errors={(errors && typeof errors !== 'string' && errors[index]) ? errors[index] as choiceCardErrorType : undefined} // give errors only if not a global error represented as string
              />
            </div>
          ))}
        </div>
      );
    };

export default AddableChoices;