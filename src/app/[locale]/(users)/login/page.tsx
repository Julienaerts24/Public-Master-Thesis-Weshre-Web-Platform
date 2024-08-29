"use client"

import React, { useState, useEffect } from "react";
import SignContainer from "@/components/Containers/sign_container";
import Link from "next/link";
import GoogleLogin from "@/components/login_user/google_icon_login";
import AppleLogin from "@/components/login_user/apple_icon_login";
import PhoneLogin from "@/components/login_user/phone_icon_login";
import LoginInput  from "@/components/login_user/input/login/login_input";
import ButtonAction from "@/components/login_user/button_action/button_action";
import {useTranslations} from 'next-intl';
import {useLocale} from 'next-intl';

export default function Login() {
  const t = useTranslations('Login');
  const [errorGoogleLogin, setErrorGoogleLogin] = useState(false);
  const [errorAppleLogin, setErrorAppleLogin] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const handleClick = () => {
      setErrorGoogleLogin(false);
      setErrorAppleLogin(false);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <SignContainer
        container={
          <>
            <div className="font-extrabold text-center leading-snug text-base sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl p-[2%]">
              {t('welcome_message')}
            </div>
            <LoginInput />
            <div className="w-full flex flex-col justify-evenly items-center pb-[3%]">
              <div className="font-bold text-center h-1/4 text-sm md:text-base lg:text-lg xl:text-xl p-[0.5%]">
                {t('or')}
              </div>
              <div className="flex flex-row justify-center h-3/4 w-1/2 p-[0.5%]">
                <PhoneLogin />
                <GoogleLogin setError={setErrorGoogleLogin} />
                <AppleLogin setError={setErrorAppleLogin} />
              </div>
                {errorGoogleLogin && <div className="text-redError text-sm font-bold pt-2">
                  {t('error_google')}
              </div>}
                {!errorGoogleLogin && errorAppleLogin && <div className="text-redError text-sm font-bold pt-2">
                  {t('error_apple')}
              </div>}
            </div>
            <ButtonAction />
            <div className="flex flex-row justify-between items-center underline w-4/5 text-[12px] md:text-base lg:text-lg xl:text-xl text-redWS cursor-pointer pt-2">
              <div className="hover:text-hoverRedWS">
                <Link href={`/${locale}/sign_up`}> {t('sign_up')} </Link>
              </div>
              <div className="hover:text-hoverRedWS">
                <Link href={`/${locale}/forgot_password`}> {t('forgot_password')} </Link>
              </div>
            </div>
            <div id="recaptcha-container"></div>
          </>
        }
    />
  );
}
