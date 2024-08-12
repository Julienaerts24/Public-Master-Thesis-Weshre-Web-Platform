import React from "react";

type EditableTextProps = {
  value: string;
  setValue: (value: string) => void;
  maxLength: number;
  isBold?: boolean;
};

const EditableText: React.FC<EditableTextProps> = ({
  value,
  setValue,
  maxLength,
  isBold = true,
}) => {

  return (
    <>
      <style jsx>{` /* Remove the arrow up and down of the input */
        .input-number::-webkit-inner-spin-button,
        .input-number::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .input-number {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="w-full h-full flex flex-row justify-start items-center">
        <input
          type="text"
          value={value}
          placeholder="..."
          onChange={(e) => setValue(e.target.value)}
          className={`w-full input-number text-lg lg:text-xl xl:text-2xl ${isBold ? "font-semibold" : "font-normal"} text-start bg-transparent border-none outline-none ${value === "" && "pl-[20px]"}`}
         maxLength={maxLength}
        />
      </div>
    </>
  );
};

export default EditableText;