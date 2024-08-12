import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, DropdownSection, Image} from "@nextui-org/react";
import React, { useEffect, ChangeEvent} from "react";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { saveSelectedAtom, nameSaveSelectedAtom} from "@/atoms/atoms_dashboard";

type NameSavesDashboardLayoutsProps = {
  listSavesNames: string[];
  cantBeChange: boolean;
};

const NameSavesDashboardLayouts: React.FC<NameSavesDashboardLayoutsProps> = ({
  listSavesNames,
  cantBeChange,
}) => {
  const t = useTranslations("MyDashboard");
  const [save, setSave] = useAtom(saveSelectedAtom);
  const [inputValue, setInputValue] = useAtom(nameSaveSelectedAtom);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <div className="w-full h-full cursor-pointer">
        {cantBeChange ? (
          <div className="w-full h-full bg-red-500 text-white font-bold px-4 text-md flex justify-center items-center" style={{ borderRadius: 45 }}>
          <input 
          type="text" 
          value={inputValue} 
          onChange={handleInputChange}
          className="bg-transparent text-white w-full h-full focus:outline-none focus:border-none" 
        />
      </div>
          
        ) : (
          <Dropdown>
            <DropdownTrigger>
              <div
                className="w-full h-full bg-redWS hover:bg-red-400 text-white font-bold px-2 text:md"
                style={{ borderRadius: 45 }}
              >
                <div className="flex flex-row w-full h-full justify-between items-center px-2 gap-2">
                  <div className={"w-full truncate"}>
                    {listSavesNames[save]}
                  </div>
                  <div className="shrink-0">
                    <Image
                      alt="Card background"
                      src={"/icons/down_arrow_white.svg"}
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="all_saves_names">
              <DropdownSection showDivider aria-label=" settingSection2">
                {listSavesNames.map((name, index) => (
                  <DropdownItem key={index} onClick={() => setSave(index)}>
                    <div className="text-center font-semibold">{name}</div>
                  </DropdownItem>
                ))}
              </DropdownSection>
              <DropdownSection aria-label="settingSection1">
                <DropdownItem
                  onPress={() => {}}
                  key="newSave"
                  className="text-white bg-redWS"
                >
                  <div className="text-center font-semibold">{t("new_save")}</div>
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </>
  );
};

export default NameSavesDashboardLayouts;
