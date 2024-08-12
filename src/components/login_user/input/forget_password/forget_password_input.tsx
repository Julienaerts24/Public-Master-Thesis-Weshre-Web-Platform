"use client";

import EmailPasswordWidget from "@/components/Inputs/email_password_input";
import { Button } from "@nextui-org/react";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import {useTranslations} from 'next-intl';

const ForgotPasswordInput: React.FC = () => {
  const t = useTranslations('ForgotPassword');
  const [email, setEmail] = useState("");
  const [emailNotValid, setEmailNotValid] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState<JSX.Element>();
  const { resetPassword } = useAuth();
  const [sendedEmail, setSendedEmail] = React.useState(false);
  const [canSendEmail, setCanSendEmail] = React.useState(true);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      setCanSendEmail(true);
      setTimerRunning(false);
      setTimeLeft(30);
    }
  }, [timerRunning, timeLeft]);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const resetEmail = async () => {
    setEmailNotValid(false); // reset error message
    setEmailErrorMessage(<> </>); // reset error message
    if (!validateEmail(email)) {
      setEmailNotValid(true);
      setEmailErrorMessage(
        <>{t('invalid_email')}</>
      );
      return;
    }
    const { result, error } = await resetPassword(email);
    if (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setEmailNotValid(true);
          setEmailErrorMessage(
            <>{t('no_account')}</>
          );
          return;
        case "auth/too-many-requests":
          setEmailNotValid(true);
          setEmailErrorMessage(
            <>{t('too_many_request')}</>
          );
          setSendedEmail(false);
          setTimerRunning(false);
          return;
        default:
          setEmailNotValid(true);
          setEmailErrorMessage(error.message);
          return;
      }
    }
    setCanSendEmail(false);
    setSendedEmail(true);
    setTimerRunning(true);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter" && canSendEmail) {
      resetEmail();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    email,
    canSendEmail,
  ]);

  return (
    <>
      <div className="w-full h-[150px] md:h-[200px] justify-center items-center">
        <EmailPasswordWidget
          email={email}
          setEmail={setEmail}
          emailNotValid={emailNotValid}
          setEmailNotValid={setEmailNotValid}
          emailErrorMessage={emailErrorMessage}
        />
      </div>
      {sendedEmail && (
        <div className="font-bold text-center leading-snug pb-[5%] px-[5%] md:text-xs lg:text-sm xl:text-base">
          {t('sended')}
          {canSendEmail
            ? `${t('now')}`
            : `${t('in')} ${timeLeft} ${t('seconds')}`}
        </div>
      )}
      <div className="flex w-full justify-center items-center">
        <Button
          className={`h-[60px] w-[95%] sm:w-4/5 rounded-[40px] transition duration-300 ease-in-out bg-redWS ${
            !canSendEmail
              ? "cursor-not-allowed"
              : "cursor-pointer hover:bg-hoverRedWS "
          }`}
          onClick={() => resetEmail()}
          disabled={!canSendEmail}
        >
          <div className="font-bold text-white text-base lg:text-3xl">
            {t('send')}
          </div>
        </Button>
      </div>
    </>
  );
};

export default ForgotPasswordInput;
