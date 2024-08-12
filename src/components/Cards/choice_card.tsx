import React, {useState} from "react";
import SelectableNumber from "@/components/Inputs/selectable_number";
import EditableText from "@/components/Inputs/editable_text";
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import {choiceCardType} from '@/type/formType';
import {choiceCardErrorType} from '@/type/formErrorType';
import {useTranslations} from 'next-intl';

type ChoiceCardProps = {
  choice: choiceCardType;
  setChoice: (updatedChoice: choiceCardType) => void;
  minValue?: number;
  maxValue?: number;
  maxLengthName?: number;
  maxLengthDescription?: number;
  descriptionTitle: string;
  deleteChoice: () => void;
  errors?: choiceCardErrorType;
};

const ChoiceCard: React.FC<ChoiceCardProps> = ({
  choice,
  setChoice,
  minValue = 0,
  maxValue,
  maxLengthName = 50,
  maxLengthDescription = 100,
  descriptionTitle,
  deleteChoice,
  errors,
}) => {
  const t = useTranslations('AddableChoice');
  const [isHovered, setIsHovered] = useState(false);

  const handleNameChange = (newName: string) => {
    setChoice({...choice, name: newName});
  };

  const handleDescriptionChange = (newDescription: string) => {
    setChoice({...choice, description: newDescription});
  };

  const handleNumberChange = (newNumber: number) => {
    setChoice({...choice, number: newNumber});
  };

  return (
    <div className="relative w-full"         
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)} >
        <div className={`w-full bg-white dark:bg-darkGray my-2 py-4 px-5 rounded-3xl overflow-hidden flex flex-col ${errors ? "border-2 border-redError" : ""}`}>
            <div className="w-full flex flex-row justify-between items-center">
              <div className="w-5/12 pr-5">
                <EditableText
                  value={choice.name}
                  setValue={handleNameChange}
                  maxLength={maxLengthName}
                />
              </div>
              <div className="w-0 sm:w-7/12 pr-5 max-sm:hidden">
                <EditableText
                  value={choice.description}
                  setValue={handleDescriptionChange}
                  maxLength={maxLengthDescription}
                  isBold={false}
                />
              </div>
              <div>
                <SelectableNumber
                  value={choice.number}
                  setValue={handleNumberChange}
                  minValue={minValue}
                  maxValue={maxValue}
                />
              </div>
              <div className={`absolute top-0 right-0 max-md:opacity-100 max-md:visible transition-opacity duration-1000 ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <CircleIconButton
                  circleSize={25}
                  iconSize={15}
                  circleColor="#ff5757"
                  iconFileAddress="/icons/cross_white.svg"
                  responsiveness={10}
                  onClick={deleteChoice}
                  />
              </div>
            </div>
          <div className="w-full sm:w-0 sm:hidden">
            <div className="flex flex-row w-full">
              <div className="input-number text-lg font-semibold text-start bg-transparent border-none outline-none pr-4">
                {descriptionTitle + ":"}
              </div>
              <EditableText
                value={choice.description}
                setValue={handleDescriptionChange}
                maxLength={maxLengthDescription}
              />
            </div>
          </div>
        </div>
        {errors && <div className="text-redError text-sm font-bold text-justify px-2 pb-3">{errors.name ? errors.name : errors.number }</div>}
    </div>
  );
};

export default ChoiceCard;
