import React from "react";
import { Textarea } from "@nextui-org/react";


type TextAreaWithTitleProps = {
  label: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  maxLength: number;
  minRow: number;
  maxRow: number;
  disable?: boolean;
  error?: string;
};

const TextAreaWithTitle: React.FC<TextAreaWithTitleProps> = ({ label, placeholder, value, setValue, maxLength, minRow, maxRow, disable = false, error}) => {
  return (
    <div className={`w-full h-full flex flex-col px-4 lg:px-0 pb-4`}>
      <Textarea
        isInvalid={error !== undefined}
        isDisabled={disable}
        errorMessage={error}
        variant="bordered"
        label={label}
        labelPlacement="outside"
        placeholder={placeholder}
        value={value}
        onValueChange={setValue}
        minRows={minRow}
        maxRows={maxRow}
        classNames={{
          label: "text-lg lg:text-xl xl:text-2xl font-semibold",
          errorMessage: "text-sm font-bold",
          inputWrapper: `border-0 bg-white dark:bg-darkGray hover:bg-white dark:hover:bg-darkGray ${error !== undefined ? "border-2 border-redError hover:border-0 focus:border-0" : ""}`,
        }}
        maxLength={maxLength}
      />
    </div>
  );
}

export default TextAreaWithTitle;