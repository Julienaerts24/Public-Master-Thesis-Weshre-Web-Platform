import React, { useState, useEffect } from "react";

type InputNumberProps = {
  value: string;
  setValue: (value: string) => void;
  minValue?: number;
  maxValue?: number;
  decimalPlaces?: number;
  isError?: Boolean;
};

const InputNumber: React.FC<InputNumberProps> = ({
  value,
  setValue,
  minValue,
  maxValue,
  decimalPlaces = 2,
  isError,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow numbers, a single decimal point, or a blank value to facilitate correction.
    if (/^\d*\.?\d*$/.test(input) || input === "") {
      setInputValue(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processFinalValue(inputValue);
    }
  };

  const processFinalValue = (finalValue: string) => {
    if (finalValue === "") {
      setInputValue(value);
    } else {
      let newValue = parseFloat(finalValue);
      if (!isNaN(newValue)) {
        newValue = parseFloat(newValue.toFixed(decimalPlaces));
        if (maxValue && newValue > maxValue) {
          setErrorMessage(`Max value = ${maxValue}`);
          setValue(String(maxValue));
          setInputValue(String(maxValue));
        } else if (minValue && newValue < minValue) {
          setErrorMessage(`Min value = ${minValue}`);
          setValue(String(minValue));
          setInputValue(String(minValue));
        } else {
          setValue(String(newValue));
          setInputValue(String(newValue));
          setErrorMessage(null);
        }
      } else {
        setErrorMessage("Invalid number");
      }
    }
  };

  return (
    <>
      <input
        placeholder="..."
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={() => processFinalValue(inputValue)}
        onKeyDown={handleKeyDown}
        className={`input-number font-bold text-base lg:text-2xl xl:text-3xl text-center bg-grayBackground dark:bg-fadeGray rounded-xl w-[80px] md:w-[120px] h-[56px] outline-none text-black ${isError ? "border-2 border-redError" : "border-none"}`}
      />
      {errorMessage && <div className="text-red-500 font-bold">{errorMessage}</div>}
    </>
  );
};

export default InputNumber;
