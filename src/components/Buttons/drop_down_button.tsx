import React from "react";
import { DropdownTrigger } from "@nextui-org/react";
import { IoMdArrowDropdown } from "react-icons/io";

type DropDownButtonProps = {
  value: number;
}

const DropDownButton: React.FC<DropDownButtonProps> = ({value}) => {
  return (
    <DropdownTrigger>
    <div
    className="w-full h-full bg-redWS hover:bg-red-400 text-white font-bold px-2 py-0 text:md"
    style={{ borderRadius: 45 }}
    >
      <div className="flex flex-row h-full items-center p-2">
        <div className="self-center text-lg md:text-2xl font-semibold text-white">
        {value}
        </div>
        <IoMdArrowDropdown style={{ color: 'white', fontSize: '30px' }} />
      </div>
    </div>
    </DropdownTrigger>
  );
};

export default DropDownButton;


