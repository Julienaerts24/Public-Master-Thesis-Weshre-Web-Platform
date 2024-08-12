"use client";

import React, {useState} from "react";
import { Button } from "@nextui-org/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "react-phone-input-2/lib/style.css";
import { useAtomValue, useSetAtom} from "jotai";
import {useResetLoginAtoms, LoginStateAtom, LoginEmailAtom, LoginEmailNotValidAtom, LoginEmailErrorMessageAtom, LoginPasswordAtom, LoginPasswordNotValidAtom, LoginPasswordErrorMessageAtom} from '@/atoms/atoms';
import {useTranslations} from 'next-intl';
  
const ButtonActionEmail: React.FC = () => {
    const t = useTranslations('Login');
    const LoginState = useAtomValue(LoginStateAtom);
    const email = useAtomValue(LoginEmailAtom);
    const setEmailNotValid = useSetAtom(LoginEmailNotValidAtom);
    const setEmailErrorMessage = useSetAtom(LoginEmailErrorMessageAtom);

    const password = useAtomValue(LoginPasswordAtom);
    const setPasswordNotValid = useSetAtom(LoginPasswordNotValidAtom);
    const setPasswordErrorMessage = useSetAtom(LoginPasswordErrorMessageAtom);

    const router = useRouter();
    const { logIn } = useAuth();

    const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i);

    const resetLoginAtoms = useResetLoginAtoms();
    const doResetLoginAtoms = () => {
        resetLoginAtoms();
    };

    const [loading, setLoading] = useState(false);

    const ActionButtonClick = async () => {
        setLoading(true);
        setEmailNotValid(false); // reset error message
        setEmailErrorMessage(<> </>); // reset error message
        setPasswordNotValid(false); // reset error message
        setPasswordErrorMessage(<> </>); // reset error message
        if (!validateEmail(email)) {
          setEmailNotValid(true);
          setEmailErrorMessage(<>{t('valid_email')}</>);
          setLoading(false);
          return;
        }
        if (password === "") {
          setPasswordNotValid(true);
          setPasswordErrorMessage(<>{t('enter_password')}</>);
          setLoading(false);
          return;
        }
        const { result, error } = await logIn(email, password);
        if (error) {
          switch (error.code) {
            case "auth/user-not-found":
              setEmailNotValid(true);
              setEmailErrorMessage(
                <>{t('no_account_email')}</>
              );
              setLoading(false);
              return;
            case "auth/wrong-password":
              setPasswordNotValid(true);
              setPasswordErrorMessage(<>{t('incorrect_password')}</>);
              setLoading(false);
              return;
            case "auth/too-many-requests":
              setPasswordNotValid(true);
              setPasswordErrorMessage(
                <>
                  {t('many_incorrect_password')}
                  <a
                    href="/reset-password"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/forgot_password");
                    }}
                    style={{ textDecoration: "underline" }}
                  >
                    {t('reset_password')}
                  </a>
                </>
              );
              setLoading(false);
              return;
            default:
              setPasswordNotValid(true);
              setPasswordErrorMessage(
                <>
                  {t('unknow_error')}
                </> // ADD LINK TO CONTACT PAGE
              );
              setLoading(false);
              return;
          }
        }
        doResetLoginAtoms();
        return router.push("/myActivities");
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
        email,
        password,
        LoginState,
      ]);

  return (
    <Button
    className="flex h-[60px] justify-center items-center w-4/5 bg-redWS cursor-pointer rounded-[40px] transition duration-300 ease-in-out hover:bg-hoverRedWS"
    onClick={ActionButtonClick}
    >
    {loading ? (
    <div className="font-bold text-white text-2xl lg:text-3xl">
      {t('loading')}
    </div>
  ) : (
    <div className="font-bold text-white text-2xl lg:text-3xl">
      {t('login')}
    </div>
  )}
  </Button>
  );
};

export default ButtonActionEmail;
