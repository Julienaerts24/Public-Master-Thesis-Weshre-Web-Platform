import React from "react";
import TextAreaWithTitle from "@/components/Inputs/text_area_with_title"

type inputTextProps = {
    title: string | undefined,
    placeholder: string | undefined,
    value: string;
    setValue: (value: string) => void;
    maxLength?: number;
    minRow?: number;
    maxRow?: number;
    disableChange?: boolean;
    errors?: string;
  };
  
  const inputText: React.FC<inputTextProps> = ({ title, placeholder, maxLength = 200, value, setValue, minRow = 1, maxRow = 5, errors, disableChange}) => {
  return (
    <div className="w-full">
      <TextAreaWithTitle
        label={title || ""}
        placeholder={placeholder || ""}
        value={value}
        setValue={setValue}
        maxLength={maxLength}
        minRow={minRow}
        maxRow={maxRow}
        disable={disableChange}
        error={errors}
      />
    </div>
  );
}

export default inputText;