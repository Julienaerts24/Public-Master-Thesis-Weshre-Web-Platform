import React from "react";
import { useTranslations } from "next-intl";
import ChoiceModalCard from "@/components/Cards/choice_modal_card";
import CircleIconButton from "@/components/Buttons/circle_icon_button";
import AddChoiceModal from '@/components/Modals/add_choice_modal';
import {useDisclosure} from "@nextui-org/react";
import RedRoundedButton from "@/components/Buttons/rounded_button";
import {choicesType} from '@/type/formType';

type MultipleChoiceModalProps = {
  title?: string;
  description?: string;
  selected: string[];
  setSelected: (value: string[]) => void;
  multipleSelection?: boolean;
  choices?: choicesType[];
  useKeyInSearch?: boolean; // Boolean to say if we need to use the key in the research (usefull for the language)
  dictionnaryKey?: string;
  isPhone?: Boolean;
  disableChange?: boolean;
  errors?: string;
};

const MultipleChoiceModal: React.FC<MultipleChoiceModalProps> = ({
  title = "",
  description = "",
  selected,
  setSelected,
  choices = [],
  useKeyInSearch,
  dictionnaryKey = "MultipleChoiceModalDefault",
  multipleSelection = true,
  isPhone = false,
  errors,
}) => {
  const t = useTranslations(dictionnaryKey);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full flex flex-col justify-start items-start px-4 lg:px-0">
      {title && <div className={`w-full text-lg lg:text-xl xl:text-2xl font-semibold pb-1 sm:pb-2 ${errors ? "" : ""}`}>
          {title}
      </div>}
      {description && <div className={`w-full text-sm lg:text-lg xl:text-xl font-light pb-1 sm:pb-3 ${errors ? "" : ""}`}>
          {description}
      </div>}
      {errors && <div className="text-redError font-bold text-justify pb-3">{errors}</div>}
      <div className={`flex flex-row flex-wrap justify-start items-center h-full w-full sm:pt-1 gap-4`}>
      {selected.map((code, index) => {
          const choice = choices.find(choice => choice.key === code);
          return choice ? (
            <ChoiceModalCard
              key={index}
              code={choice.key}
              name={choice.title}
              icon={choice.icon}
              useKeyInSearch={useKeyInSearch}
              onPress={() => {}}
              isDeletable={multipleSelection ?? true}
              onDelete={() => setSelected(selected.filter(item => item !== code))}
            />
          ) : null;
        })}
        { !isPhone && ( 
          selected.length === 0 ? 
            <RedRoundedButton
              text={t("add")}
              sizeText={18}
              onClick={onOpen}
              size="md"
              icon="/icons/plus_white.svg"
              isError={errors !== undefined}
            /> : 
            multipleSelection ? 
            <CircleIconButton
              circleSize={35}
              iconSize={25}
              circleColor="#ff5757"
              iconFileAddress={multipleSelection ? "/icons/plus_white.svg" : "/icons/customization.svg"}
              onClick={onOpen}
              responsiveness={0}
            /> : <RedRoundedButton
              text={t("edit")}
              sizeText={18}
              onClick={onOpen}
              size="md"
              icon="/icons/customization.svg"
              isError={errors !== undefined}
            />)}
      </div>
      { isPhone && 
      <div className="w-full flex justify-center mt-4">
        <RedRoundedButton
          text={(multipleSelection || selected.length === 0) ? t("add") : t("edit")}
          sizeText={18}
          onClick={onOpen}
          size="md"
          icon={(multipleSelection || selected.length === 0) ? "/icons/plus_white.svg" : "/icons/customization.svg"}
          isError={errors !== undefined}
          responsiveness={20}
        />
      </div>
      }
      <AddChoiceModal isOpen={isOpen} onOpenChange={onOpenChange} title={t("title")} selected={selected} setSelected={setSelected} multipleSelection={multipleSelection} choices={choices} useKeyInSearch={useKeyInSearch}/>
    </div>
  );
};

export default MultipleChoiceModal;

