"use client";

import EmailPasswordWidget from "@/components/Inputs/email_password_input";
import { Button } from "@nextui-org/react";
import { useAuth } from "@/context/AuthContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {useTranslations} from 'next-intl';
import Link from "next/link";
import {useResetLoginAtoms} from '@/atoms/atoms';
import { auth } from "@/firebase/config";

const SignInInput: React.FC = () => {
  const t = useTranslations('SignUp');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailNotValid, setEmailNotValid] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<JSX.Element>();
  const [passwordNotValid, setPasswordNotValid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<JSX.Element>();
  const router = useRouter();
  const { signUp } = useAuth();

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const resetLoginAtoms = useResetLoginAtoms();
  const doResetLoginAtoms = () => {
      resetLoginAtoms();
  };

  const SignUpButtonClick = async () => {
    setEmailNotValid(false);
    setEmailErrorMessage(<> </>);
    setPasswordNotValid(false);
    setPasswordErrorMessage(<> </>);
    if (!validateEmail(email)) {
      setEmailNotValid(true);
      setEmailErrorMessage(<>{t('invalid_email')}</>);
      return;
    }
    if (password === "") {
      setPasswordNotValid(true);
      setPasswordErrorMessage(<>{t('enter_password')}</>);
      return;
    }
    if (password.length > 40) {
      setPasswordNotValid(true);
      setPasswordErrorMessage(<>{t('too_long_password')}</>);
      return;
    }
    const { result, error } = await signUp(email, password);
    if (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setEmailNotValid(true);
          setEmailErrorMessage(
            <>
              {t('email_already_use')}
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/login");
                }}
                style={{ textDecoration: "underline" }}
              >
                {t('login_here')}
              </a>
            </>
          );
          return;
        case "auth/weak-password":
          setPasswordNotValid(true);
          setPasswordErrorMessage(
            <>{t('passsword_six_characters')}</>
          );
          return;
        default:
          setPasswordNotValid(true);
          setPasswordErrorMessage(
            <>{t('unknow_error')}</>
          );
          return;
      }
    }
    doResetLoginAtoms();
    router.push("/myActivities");

    // In order to test the creation of account I need to alwauys delete it after creation
    if (email === "playwright_test_account_creation@test.com") {
      await new Promise(resolve => setTimeout(resolve, 3000)).then();
      await auth.currentUser!.delete();
    }
    
    return;
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      SignUpButtonClick();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    email,
    password,
  ]);

  return (
    <>
      <div className="w-full h-[200px] md:h-[300px] justify-center items-center">
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
      <div className="flex flex-col w-full justify-center items-center">
        <Button
          className="h-[60px] w-4/5 bg-redWS cursor-pointer rounded-[40px] transition duration-300 ease-in-out hover:bg-hoverRedWS"
          onClick={SignUpButtonClick}
        >
          <div className="font-bold text-white text-2xl lg:text-3xl">
            {t('create_account')}
          </div>
        </Button>
        <div className="text-center underline w-4/5 text-[14px] md:text-base lg:text-lg xl:text-xl text-redWS cursor-pointer pt-2 hover:text-hoverRedWS">
          <Link href="/login"> {t("login_here")} </Link>
        </div>
      </div>
    </>
  );
};

export default SignInInput;
