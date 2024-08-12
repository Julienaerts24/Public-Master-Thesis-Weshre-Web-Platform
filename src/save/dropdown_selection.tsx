import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import React from "react";

type DropDownSelectionProps = {
  labels: string[],
  value: number,
  setValue: (index: number) => void
};

const DropDownSelection: React.FC<DropDownSelectionProps> = ({ labels, value, setValue }) => {

  return (
    <Dropdown type="menu" className="dark:bg-darkGray">
      <DropdownTrigger>
        <div className="w-full flex flex-row items-center justify-center cursor-pointer">
          <div className="self-center text-lg md:text-3xl font-semibold text-black dark:text-white">
            {labels[value]}
          </div>
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="periodMenu">
        {labels.map((label, i) => (
          <DropdownItem key={i} textValue="label" onPress={() => setValue(i)}>
            <div className="text-center font-semibold text-xl">
              {label}
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropDownSelection;