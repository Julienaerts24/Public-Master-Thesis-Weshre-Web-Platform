import React from 'react';
import { Input } from "@nextui-org/react";

interface InputTextBorderedProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  invalid?: boolean;
  disable?: boolean;
  errorMessage?: string;
}

const InputTextBordered: React.FC<InputTextBorderedProps> = ({
  value,
  onValueChange,
  onBlur,
  onKeyDown,
  label,
  placeholder,
  invalid = false,
  disable = false,
  errorMessage,
}) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onKeyDown) {
        onKeyDown(e);
    }
  };
  
  return (
    <div className='w-full'>
      <Input
        value={value}
        onValueChange={onValueChange}
        onBlur={() => onBlur && onBlur()} 
        onKeyDown={handleKeyDown}
        variant="bordered"
        isInvalid={invalid}
        isDisabled={disable}
        isClearable
        size="lg"
        radius="lg"
        aria-label={label}
        classNames={{
          input: `text-lg`,
          inputWrapper: `shadow-none text-black dark:text-white bg-white dark:bg-darkGray hover:bg-white dark:hover:bg-darkGray opacity-80 `,
          label: `font-semibold`,
        }}
        label={label}
        placeholder={placeholder}
      />
      {errorMessage && <div className="text-redError text-sm p-1 font-bold">{errorMessage}</div>}
    </div>

  );
};

export default InputTextBordered;