"use client";

import React from 'react';
import { useAtomValue } from "jotai";
import InputEmail from "@/components/login_user/input/login/login_email_input";
import InputPhoneNumber from "@/components/login_user/input/login/login_phoneNumber_input";
import InputVerificationCode from "@/components/login_user/input/login/login_verificationCode";
import { LoginStateAtom } from "@/atoms/atoms";

const LoginInput: React.FC = () => {
  const LoginState = useAtomValue(LoginStateAtom);
  let LoginInput;
  switch (LoginState) {
    default:
      LoginInput = <InputEmail />;
      break;
    case "PhoneNumber":
      LoginInput = <InputPhoneNumber />;
      break;
    case "VerificationCode":
      LoginInput = <InputVerificationCode />;
      break;
  }

  return LoginInput;
};

export default LoginInput;
