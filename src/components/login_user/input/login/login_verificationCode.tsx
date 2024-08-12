"use client";

import React from "react";
import ReactCodeInput from "react-code-input";
import "react-phone-input-2/lib/style.css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {LoginStateAtom, LoginPhoneNumberAtom, LoginVerificationCodeAtom, LoginVerificationCodeNotValidAtom, LoginVerificationCodeErrorMessageAtom} from "@/atoms/atoms";
import {useTranslations} from 'next-intl';

const InputVerificationCode: React.FC = () => {
  const t = useTranslations('Login');
  const setLoginState = useSetAtom(LoginStateAtom);
  const phoneNumber = useAtomValue(LoginPhoneNumberAtom);
  const [verificationCode, setVerificationCode] = useAtom(LoginVerificationCodeAtom);
  const [verificationCodeNotValid, setVerificationCodeNotValid] = useAtom(LoginVerificationCodeNotValidAtom);
  const [verificationCodeErrorMessage, setVerificationCodeErrorMessage] = useAtom(LoginVerificationCodeErrorMessageAtom);

  const handleVerificationCodeChange = (value: string) => {
    setVerificationCodeNotValid(false);
    setVerificationCodeErrorMessage(<></>);
    setVerificationCode(value);
  };

  return (
    <div className="h-[300px] w-full flex flex-col justify-center items-center grow-1">
      <div className="text-xl xl:text-2xl text-center font-bold pb-0.5 mt-4 mb-6">
        {`${t('enter_code')} ${phoneNumber}`}
      </div>
      <div className="w-full flex flex-row justify-center items-center">
        <ReactCodeInput
          type="text"
          fields={6}
          value={verificationCode}
          onChange={handleVerificationCodeChange}
          name="codeInput"
          inputMode="numeric"
          isValid={!verificationCodeNotValid}
          filterChars = {[
            "a", "à", "b", "c", "ç", "d", "e", "é", "è",  "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
            "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~", " ", "°"
          ]}
          inputStyle={{
            margin: "6px",
            width: "33px",
            height: "43px",
            borderRadius: "5px",
            fontSize: "calc(15px + 1vw)",
            border: "1px solid black",
            textAlign: "center",
          }}
        />
      </div>
      <div className="w-11/12 text-center text-red-500">
        {verificationCodeErrorMessage}
      </div>
      <div className="mt-4 text-xs vsm:text-sm sm:text-base lg:text-lg">
        <a
          href="/resend-code"
          onClick={(e) => {
            e.preventDefault();
            setLoginState("PhoneNumber");
          }}
          style={{ textDecoration: "underline" }}
        >
          {t('code_not_receive')}
        </a>
      </div>
    </div>
  );
};

export default InputVerificationCode;
