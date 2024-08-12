"use client";

import React from 'react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTheme } from "next-themes";
import { useAtom } from "jotai";
import { LoginPhoneNumberAtom,LoginPhoneNumberNotValidAtom, LoginPhoneNumberErrorMessageAtom} from "@/atoms/atoms";
import {useTranslations} from 'next-intl';

const InputPhoneNumber: React.FC= () => {
  const t = useTranslations('Login');
  const [phoneNumber, setPhoneNumber] = useAtom(LoginPhoneNumberAtom);
  const [phoneNumberNotValid, setPhoneNumberNotValid] = useAtom(
    LoginPhoneNumberNotValidAtom
  );
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] = useAtom(
    LoginPhoneNumberErrorMessageAtom
  );

  const { theme } = useTheme();
  const ModeStyle =
    theme === "dark"
      ? { background: "#121212", color: "white", Selection: "#121212" }
      : { color: "black" };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumberNotValid(false);
    setPhoneNumberErrorMessage(<></>);
    setPhoneNumber(value);
  };

  return (
    <div className="h-[300px] w-full flex flex-col justify-center items-center grow-1">
      <div className="text-base sm:text-xl xl:text-2xl text-center font-bold pb-0.5 mb-5">
        {t('ask_phone_number')}
      </div>
      <div className="max-w-[300px] w-full md:w-3/4 flex flex-col">
        <PhoneInput
          country="be"
          placeholder={t('enter_phone_number')}
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          enableSearch={true}
          disableSearchIcon={true}
          isValid={!phoneNumberNotValid}
          inputStyle={{
            width: "100%",
            height: "180%",
            fontSize: "25px",
            ...ModeStyle,
          }}
          buttonStyle={{
            height: "180%",
            fontSize: "calc(6px + 1vh)",
            ...ModeStyle,
          }}
          dropdownStyle={{
            ...ModeStyle,
          }}
        />
        <div className="w-full text-left mt-8 text-red-500">
          {phoneNumberErrorMessage}
        </div>
      </div>
    </div>
  );
};

export default InputPhoneNumber;
