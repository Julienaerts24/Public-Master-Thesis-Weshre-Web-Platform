"use client";

import React from 'react';
import EmailPasswordWidget from "@/components/Inputs/email_password_input";
import { useAtom, useAtomValue } from "jotai";
import { LoginEmailAtom, LoginEmailNotValidAtom, LoginEmailErrorMessageAtom, LoginPasswordAtom,LoginPasswordNotValidAtom, LoginPasswordErrorMessageAtom  } from "@/atoms/atoms";

const InputEmail: React.FC = () => {
  const [email, setEmail] = useAtom(LoginEmailAtom);
  const [emailNotValid, setEmailNotValid] = useAtom(LoginEmailNotValidAtom);
  const emailErrorMessage = useAtomValue(LoginEmailErrorMessageAtom);

  const [password, setPassword] = useAtom(LoginPasswordAtom);
  const [passwordNotValid, setPasswordNotValid] = useAtom(LoginPasswordNotValidAtom);
  const passwordErrorMessage = useAtomValue(LoginPasswordErrorMessageAtom);

  return (
    <div className="w-full h-[180px] md:h-[300px] justify-center items-center">
      <EmailPasswordWidget
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={true}
        emailNotValid={emailNotValid}
        setEmailNotValid={setEmailNotValid}
        emailErrorMessage={emailErrorMessage}
        passwordNotValid={passwordNotValid}
        setPasswordNotValid={setPasswordNotValid}
        passwordErrorMessage={passwordErrorMessage}
      />
    </div>
  );
};

export default InputEmail;
