import React from "react";
import SwitchWS from "@/components/Buttons/switch";

type BooleanChoiceProps = {
  title?: string;
  description?: string;
  value: boolean;
  setValue: (value: boolean) => void;
  disableChange?: boolean;
  errors?: string;
};

const BooleanChoice: React.FC<BooleanChoiceProps> = ({
  title = "",
  description = "",
  value, 
  setValue,
  disableChange,
  errors
}) => {
  return (
    <div className={`w-full ${disableChange ? "bg-disableCardColor dark:bg-disableDarkCardColor" : "bg-cardColor dark:bg-darkCardColor"} my-3 py-4 px-5 rounded-3xl overflow-hidden flex flex-row justify-between items-center ${errors ? "border-2 border-redError" : ""}`}>
      <div className="w-full flex flex-col">
        <div className="text-lg lg:text-xl xl:text-2xl font-semibold">{title}</div>
        <div className="text-sm lg:text-lg xl:text-xl font-light text-justify pr-4">{description}</div>
      </div>
      <SwitchWS
        value={value}
        setValue={setValue}
        disable={disableChange}
      />
    </div>
  );
};

export default BooleanChoice;