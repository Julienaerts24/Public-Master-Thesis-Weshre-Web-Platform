"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import "react-phone-input-2/lib/style.css";
import { useAtom, useAtomValue, useSetAtom} from "jotai";
import {useResetLoginAtoms, LoginStateAtom, LoginVerificationCodeAtom, LoginVerificationCodeNotValidAtom, LoginVerificationCodeErrorMessageAtom, LoginResultCodeErrorMessageAtom, RecaptchaWidgetIdAtom} from '@/atoms/atoms';
import {useTranslations} from 'next-intl';
 
declare var grecaptcha: any;

const ButtonActionVerificationCode: React.FC= () => {
    const t = useTranslations('Login');
    const [LoginState, setLoginState] = useAtom(LoginStateAtom);
    const verificationCode = useAtomValue(LoginVerificationCodeAtom);
    const setVerificationCodeNotValid = useSetAtom(LoginVerificationCodeNotValidAtom);
    const setVerificationCodeErrorMessage = useSetAtom(LoginVerificationCodeErrorMessageAtom);
    const [resultCode] = useAtom(LoginResultCodeErrorMessageAtom);
    const router = useRouter();
    const validateCode = (code: string) => code.match(/^\d{6}$/);
    const resetLoginAtoms = useResetLoginAtoms();
    const doResetLoginAtoms = () => {
        resetLoginAtoms();
    };
    const recaptchaWidgetId = useAtomValue(RecaptchaWidgetIdAtom);

    const resetRecaptcha = () => {
      if (recaptchaWidgetId !== null) {
        grecaptcha.reset(recaptchaWidgetId);
      }
    };

    const ActionButtonClick = async () => {
            if (!validateCode(verificationCode)) {
              setVerificationCodeNotValid(true);
              setVerificationCodeErrorMessage(
                <>{t('six_digits')}</>
              );
              console.error("Invalid verification code format.");
              return;
            }
            resultCode!
              .confirm(verificationCode)
              .then((userCredential) => {
                setVerificationCodeNotValid(false);
                doResetLoginAtoms();
                router.push("/myActivities");
              })
              .catch((error) => {
                resetRecaptcha();
                setVerificationCodeNotValid(true);
                switch (error.code) {
                  case "auth/invalid-verification-code":
                    setVerificationCodeNotValid(true);
                    setVerificationCodeErrorMessage(
                      <>{t('incorrect_code')}</>
                    );
                    return;
                  case "auth/code-expired":
                    setVerificationCodeNotValid(true);
                    setVerificationCodeErrorMessage(
                      <>
                        {t('expired_code')}
                        <a
                          href="/resend-code"
                          onClick={(e) => {
                            e.preventDefault();
                            setLoginState("PhoneNumber");
                          }}
                          style={{ textDecoration: "underline" }}
                        >
                          {t('resend_code')}
                        </a>
                      </>
                    );
                    return;
                  default:
                    setVerificationCodeNotValid(true);
                    setVerificationCodeErrorMessage(
                      <>
                        {t('unknow_error')}
                      </> // ADD LINK TO CONTACT PAGE
                    ); // TO CHANGE DEPENDING OF ALL POSIBLE ERRORS
                    return;
                }
              });
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
        verificationCode,
        resultCode,
      ]);

  return (
    <Button
    className="flex h-[60px] justify-center items-center w-4/5 bg-redWS cursor-pointer rounded-[40px] transition duration-300 ease-in-out hover:bg-hoverRedWS"
    onClick={ActionButtonClick}
  >
    <div className="font-bold text-white text-lg lg:text-xl xl:text-2xl">
      {t('confirm')}
    </div>
  </Button>
  );
};

export default ButtonActionVerificationCode;
