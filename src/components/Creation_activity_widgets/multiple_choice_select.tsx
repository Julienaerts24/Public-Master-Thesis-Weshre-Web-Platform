import React from "react";
import InputFloatNumber from "@/components/Inputs/input_float_number";
import { Select, SelectItem } from "@nextui-org/react";

type MultipleChoiceSelectProps = {
  labelChoices?: { label: string; key: string }[];
  selected: string[];
  setSelected: (value: string[]) => void;
  title?: string;
  description?: string;
  disableChange?: boolean;
  errors?: string;
};

const MultipleChoiceSelect: React.FC<MultipleChoiceSelectProps> = ({
  labelChoices = [{ label: "", key: "" }],
  selected,
  setSelected,
  title = "",
  description = "",
  disableChange,
  errors,
  
}) => {
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected([e.target.value]);
  };

  return (
    <div>
      <div className={`w-full bg-white dark:bg-darkGray my-3 py-4 px-5 rounded-3xl overflow-hidden flex flex-row justify-between items-center ${errors ? "border-2 border-redError" : ""}`}>
        <div className="w-full flex flex-col">
          <div className={`text-lg lg:text-xl xl:text-2xl font-semibold ${errors ? "" : ""}`}>
              {title}
          </div>
          <div className={`text-sm lg:text-lg xl:text-xl font-light text-start pr-4 ${errors ? "" : ""}`}>
              {description}
          </div>
        </div>
        <div className="h-full w-[200px]">
          <Select
            aria-label="Labeled Choices"
            onChange={handleSelectionChange}
            defaultSelectedKeys={selected}
            size={"md"}
            isDisabled={disableChange}
            isInvalid={errors !== undefined}
            disallowEmptySelection={true}
            classNames={{
              base: "text-sm lg:text-xl xl:text-2xl font-bold",
              value:"text-black dark:text-white text-lg lg:text-xl xl:text-2xl font-bold",
              trigger: `bg-grayBackground dark:bg-fadeGray ${errors !== undefined && "border-2 border-redError"}`,
            }}
          >
            {labelChoices.map((choice) => (
              <SelectItem
                aria-label={choice.label}
                key={choice.key}
                value={choice.key}
              >
                {choice.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      {errors && <div className="text-redError text-sm px-2 font-bold">{errors}</div>}
    </div>
  );
};

export default MultipleChoiceSelect;
