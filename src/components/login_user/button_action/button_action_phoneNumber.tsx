"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/config";
import { RecaptchaVerifier } from "firebase/auth";
import { useEffect, useRef } from "react";
import "react-phone-input-2/lib/style.css";
import { useAtom, useAtomValue, useSetAtom} from "jotai";
import {LoginStateAtom, LoginPhoneNumberAtom, LoginPhoneNumberNotValidAtom, LoginPhoneNumberErrorMessageAtom, LoginResultCodeErrorMessageAtom, RecaptchaWidgetIdAtom} from '@/atoms/atoms';
import {useTranslations} from 'next-intl';
declare var grecaptcha: any;
  
const ButtonActionPhoneNumber: React.FC = () => {
    const t = useTranslations('Login');
    const [LoginState, setLoginState] = useAtom(LoginStateAtom);
    const phoneNumber = useAtomValue(LoginPhoneNumberAtom);
    const setPhoneNumberNotValid = useSetAtom(LoginPhoneNumberNotValidAtom);
    const setPhoneNumberErrorMessage = useSetAtom(LoginPhoneNumberErrorMessageAtom);
    const setResultCode = useSetAtom(LoginResultCodeErrorMessageAtom);
    const { signInWithPhone } = useAuth();
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
    const setRecaptchaWidgetId = useSetAtom(RecaptchaWidgetIdAtom);

    const ActionButtonClick = async () => {
          if (!recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = new RecaptchaVerifier(
              auth,
              "recaptcha-container",
              {
                size: "invisible",
              }
            );
          }
          const { result, error } = await signInWithPhone(
            "+" + phoneNumber,
            recaptchaVerifierRef.current
          );
          if (error) {
            if (recaptchaVerifierRef.current) {
              recaptchaVerifierRef.current.render().then((widgetId) => {
                grecaptcha.reset(widgetId);
              });
            }
            switch (error.code) {
              case "auth/invalid-phone-number":
                setPhoneNumberNotValid(true);
                setPhoneNumberErrorMessage(
                  <>{t('correct_phone_number')}</>
                );
                return;
              case "auth/too-many-requests":
                setPhoneNumberNotValid(true);
                setPhoneNumberErrorMessage(
                  <>{t('too_many_request')}</>
                );
                return;
              default:
                setPhoneNumberNotValid(true);
                setPhoneNumberErrorMessage(
                  <>
                  {t('unknow_error')}
                  </> // ADD LINK TO CONTACT PAGE
                ); // TO CHANGE DEPENDING OF ALL POSSIBLE ERRORS
                return;
            }
          } else {
            recaptchaVerifierRef.current.render().then((widgetId) => {
              setRecaptchaWidgetId(widgetId);
              setLoginState("VerificationCode");
              setResultCode(result);
            });
          }
        };

      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          ActionButtonClick();
        }
      };
    
      useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
    
        return () => {
          window.removeEventListener("keydown", handleKeyPress);
        };
      }, [
        LoginState,
        phoneNumber,
      ]);

  return (
    <Button
    className="flex h-[60px] justify-center items-center w-4/5 bg-redWS cursor-pointer rounded-[40px] transition duration-300 ease-in-out hover:bg-hoverRedWS"
    onClick={ActionButtonClick}
  >
    <div className="font-bold text-white text-2xl lg:text-3xl">
      {t('send_code')}
    </div>
  </Button>
  );
};

export default ButtonActionPhoneNumber;
