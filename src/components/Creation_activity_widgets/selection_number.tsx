import React from "react";
import SelectableNumber from "@/components/Inputs/selectable_number";

type SelectionNumberProps = {
  title?: string;
  description?: string;
  value: number;
  setValue: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  disableChange?: boolean;
  errors?: string;
};

const SelectionNumber: React.FC<SelectionNumberProps> = ({
  title = "",
  description = "",
  value,
  setValue,
  minValue = 0,
  maxValue,
  errors,
}) => {
  return (
    <div>
      <div className={`w-full bg-white dark:bg-darkGray my-3 md:my-6 rounded-3xl overflow-hidden flex flex-col ${errors ? "border-2 border-redError md:mb-2" : ""}`}>
        <div className={`flex flex-row justify-between items-center px-5 py-4`}>
          <div className={`text-lg lg:text-xl xl:text-2xl font-semibold ${errors ? "" : ""}`}>
              {title}
          </div>
          <div className={`text-sm lg:text-lg xl:text-xl font-light ${errors ? "" : ""}`}>
              {description}
          </div>
          <div>
            <SelectableNumber
              value={value}
              setValue={setValue}
              minValue={minValue}
              maxValue={maxValue}
              isError={errors !== undefined}
            />
          </div>
        </div>
      </div>
      {errors && <div className="text-redError text-sm font-bold px-2">{errors}</div>}
    </div>
  );
};

export default SelectionNumber;
