"use client";

import React from "react";
import { useAtomValue } from "jotai";
import ButtonActionEmail from "@/components/login_user/button_action/button_action_email";
import ButtonActionPhoneNumber from "@/components/login_user/button_action/button_action_phoneNumber";
import ButtonActionVerificationCode from "@/components/login_user/button_action/button_action_verificationCode";
import {LoginStateAtom} from '@/atoms/atoms';
  
const ActionButton: React.FC = () => {
    const LoginState = useAtomValue(LoginStateAtom);

      let ActionButton;
      switch (LoginState) {
        case "EmailPassword":
          ActionButton = <ButtonActionEmail aria-label="Submit Email and Password"/>;
          break;
        case "PhoneNumber":
          ActionButton = <ButtonActionPhoneNumber aria-label="Submit Phone Number"/>;
          break;
        case "VerificationCode":
          ActionButton = <ButtonActionVerificationCode aria-label="Submit Verification Code"/>;
          break;
      }

  return (ActionButton);
};

export default ActionButton;
