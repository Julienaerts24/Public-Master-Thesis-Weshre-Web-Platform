import React, { useState,  useEffect} from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button} from "@nextui-org/react";
import ResearchInput from "@/components/Inputs/search_input";
import ChoiceModalCard from "@/components/Cards/choice_modal_card";
import RedRoundedButton from "@/components/Buttons/rounded_button";
import {useTranslations} from 'next-intl';
import {choicesType} from '@/type/formType';

type AddChoicesModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  selected: string[];
  setSelected: (selected: string[]) => void;
  choices: choicesType[];
  useKeyInSearch?: boolean; // Boolean to say if we need to use the key in the research (usefull for the language)
  multipleSelection?: Boolean;
};

const AddChoicesModal: React.FC<AddChoicesModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  selected,
  setSelected,
  choices,
  useKeyInSearch = false,
  multipleSelection,
}) => {
  const t = useTranslations('SelectionModal');
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [saveExpandedGroups, setSaveExpandedGroups] = useState<Record<string, boolean>>({});

  const groupChoices = (choices: choicesType[]) => {
    return choices.reduce((acc, choice) => {
      const groupName = choice.groupTitle || t('others');
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(choice);
      return acc;
    }, {} as Record<string, choicesType[]>);
  };
  
  // Set all groups to be expanded by default if search is not empry
  useEffect(() => {
    if(search != ""){
      if (Object.keys(saveExpandedGroups).length === 0) {
        setSaveExpandedGroups(expandedGroups)
      }
      const allGroups = groupChoices(choices);
      const allGroupsExpanded = Object.keys(allGroups).reduce((acc, groupName) => {
        acc[groupName] = true; 
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedGroups(allGroupsExpanded);
    }
    else{
      setExpandedGroups(saveExpandedGroups);
      setSaveExpandedGroups({});
    }
  }, [search]);
  
  const filteredChoices = choices.filter(choice => {
    const searchTerm = search.toLowerCase();
    return (choice.title.toLowerCase().includes(searchTerm) || (useKeyInSearch && choice.key.toLowerCase().includes(searchTerm))); // search regarding the name but also the key if useKeyInSearch is true
  }).sort((a, b) => {
    if (a.title === t('other')) return 1; // Ensure 'others' is always last
    if (b.title === t('other')) return -1; // Ensure 'others' is always last
    return a.title.localeCompare(b.title);
  }); // Sort alphabetically by title;

  const handleSelection = (selectedKey: string) => {
    const choiceToAdd = choices.find(choice => choice.key === selectedKey);
    if (choiceToAdd && !selected.some(choice => choice === choiceToAdd.key)) { // Choice is not yet selected => Need to select it
      multipleSelection ? 
      setSelected([...selected, choiceToAdd.key]) : // Add choiceToAdd.key from selected
      setSelected([choiceToAdd.key]) // Replace the selected by new choice
    }
    else if (choiceToAdd && selected.some(choice => choice === choiceToAdd.key)) { // Choice is already selected => Need to deselect it
      setSelected(selected.filter(choice => choice !== choiceToAdd.key)); // Remove choiceToAdd.code from selected
    }
    // if (!multipleSelection){onOpenChange(false)} // Close the modal if only one selection is autorize
    // setSearch("") // Reset search when select one
  };

  const thereAreGroups = Object.keys(groupChoices(choices)).length > 1;
  const groupedChoices = groupChoices(filteredChoices);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  // Sort groups by alphabetically order
  const sortedGroups = Object.keys(groupedChoices).sort((a, b) => {
    if (a === t('others')) return 1; // Ensure 'others' is always last
    if (b === t('others')) return -1; // Ensure 'others' is always last
    return a.localeCompare(b);
  });

  const handleClose = (isOpen: boolean) => {
    setSearch("");
    onOpenChange(isOpen);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      size="2xl"
      placement="center"
      backdrop="opaque"
      classNames={{
        header: "border-0",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -40,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent className="bg-lightBackground dark:bg-darkBackground h-[436px] xl:h-[652px] max-h-[90%] overflow-y-auto">
        <ModalHeader className="font-bold text-lg lg:text-xl xl:text-2xl flex flex-col gap-2">
          {title}
          <div className="w-full h-[48px] shrink-0 rounded-2xl">
            <ResearchInput search={search} setSearch={setSearch} size="sm" />
          </div>
        </ModalHeader>
        <ModalBody className="flex flex-col justify-start items-start overflow-y-scroll pt-3 min-h-[70px]">
         {filteredChoices.length == 0 ? 
         <div className="w-full h-full flex flex-col justify-center items-center px-5">
          <div className="text-base lg:text-lg xl:text-xl font-bold pb-5 text-center"> {t('no_result')} </div>
          <RedRoundedButton
            text={t('clear_search_button')}
            sizeText={15}
            size="md"
            onClick={() => {setSearch("")}}
          />
        </div> :
        thereAreGroups ? 
        sortedGroups.map((groupName, groupIndex) => (
          <div key={groupIndex} className="w-full">
            <div onClick={() => toggleGroup(groupName)}>
              <div className={`w-full ${expandedGroups[groupName] && "mb-3"}`}>
                <ChoiceModalCard
                  key={groupIndex}
                  code={groupName}
                  name={groupName}
                  icon={expandedGroups[groupName] ? "↑" : "↓"}
                  selected={false}
                  onPress={() => toggleGroup(groupName)}
                  cardDisplay={false}
                  useKeyInSearch={useKeyInSearch}
                />
              </div>
            </div>
            {expandedGroups[groupName] && groupedChoices[groupName].map((choice, choiceIndex) => (
              <div key={choiceIndex} className="w-[100% - 40px] mb-3 mx-5">
                <ChoiceModalCard
                  key={choiceIndex}
                  code={choice.key}
                  name={choice.title}
                  icon={choice.icon}
                  selected={selected.includes(choice.key)}
                  onPress={() => handleSelection(choice.key)}
                  onDelete={() => {}}
                  cardDisplay={false}
                  useKeyInSearch={useKeyInSearch}
                />
              </div>
            ))}
          </div>
        ))
        :
          filteredChoices.map((choice, index) => (
            <div key={index} className="w-full">
              <ChoiceModalCard
                key={index}
                code={choice.key}
                name={choice.title}
                icon={choice.icon}
                selected={selected.includes(choice.key)}
                onPress={() => handleSelection(choice.key)}
                onDelete={() => {}}
                cardDisplay={false}
                useKeyInSearch={useKeyInSearch}
              />
            </div>
          ))} 
        </ModalBody>
        <ModalFooter className="h-[72px] py-3">
          <RedRoundedButton
            text={t('confirm')}
            sizeText={18}
            size="md"
            onClick={() => handleClose(false)}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddChoicesModal;
