import React, { useState, useEffect} from "react";
import CircleIconButton from "@/components/Buttons/circle_icon_button";

type SelectableNumberProps = {
  value: number;
  setValue: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  isError?: Boolean;
};

const SelectableNumber: React.FC<SelectableNumberProps> = ({
  value,
  setValue,
  minValue = 0,
  maxValue,
  isError = false,
}) => {
  const [inputValue, setInputValue] = useState<number | "">(value);
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const goToNext = () => {
    if (maxValue === undefined || value < maxValue){
      if (minValue !== undefined && value < minValue){ // If the value is less than min, push plus == return to minValue
        setValue(Number(minValue));
        setInputValue(minValue!);
      }
      else{
        setValue(Number(value + 1));
        setInputValue(value + 1);
      }
    }
  };

  const goToPrev = () => {
    if (value > minValue){
      if (maxValue !== undefined && value > maxValue){ // If the value is more than max, push minus == return to maxValue
        setValue(Number(maxValue));
        setInputValue(maxValue!);
      }
      else{
        setValue(Number(value - 1));
        setInputValue(value - 1);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processFinalValue(inputValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value === ""){
      setInputValue("");
    }
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue !== value) {
      setValue(newValue);
    }
  };

  const processFinalValue = (finalValue: number | "") => {
    if (finalValue === "") {
      setValue(Number(minValue));
      setInputValue(minValue);
    } else {
      setValue(Number(finalValue));
      setInputValue(finalValue);
    }
  };

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
      <div className="flex flex-col justify-end items-center">
        <div className="w-full h-full flex flex-row justify-end items-end">
          <div className="flex-shrink-0 pr-3">
            <CircleIconButton
              circleSize={35}
              iconSize={25}
              circleColor="#ff5757"
              iconFileAddress="/icons/minus_white.svg"
              onClick={goToPrev}
              isDisabled={value <= minValue}
            />
          </div>
          <div className="flex flex-col">
            <input
              type="number"
              value={inputValue}
              onChange={handleChange}
              onBlur={() => processFinalValue(inputValue)}
              onKeyDown={handleKeyDown}
              className={`input-number font-bold text-xl lg:text-2xl xl:text-3xl text-center bg-transparent border-none w-12 md:w-24 outline-none ${isError ? "" : "text-black"}`}
              min={minValue}
              max={maxValue}
            />
          </div>
          <div className="flex-shrink-0 pl-3">
            <CircleIconButton
              circleSize={35}
              iconSize={25}
              circleColor="#ff5757"
              iconFileAddress="/icons/plus_white.svg"
              onClick={goToNext}
              isDisabled={maxValue !== undefined && value >= maxValue}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectableNumber;
