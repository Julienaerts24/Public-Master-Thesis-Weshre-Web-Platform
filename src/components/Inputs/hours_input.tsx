
import React from 'react';

type HoursInputProps = {
    label: string;
    size: string;
    value: string;
    setValue: (newTime: string) => void;
    isDisable?: boolean;
    isError: boolean;
  }

const HoursInput: React.FC<HoursInputProps> = ({ label, size, setValue, value, isDisable = false, isError }) => {
  return (
    <div className={`w-[${size}] pl-2 h-full ${isDisable ? "bg-disableCardColor dark:bg-disableDarkCardColor" : "bg-cardColor dark:bg-darkCardColor"} rounded-xl flex flex-row items-center justify-between ${isError ? "border-2 border-redError text-redError" : "p-0.5"}`}>
      <div>{label}</div>
      <input
        type="time"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`w-[100px] p-2 font-normal bg-transparent border-0 focus:border-0 focus:outline-none focus:ring-0`}
        disabled={isDisable}
      />
      <style jsx>{`
        input[type="time"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default HoursInput;