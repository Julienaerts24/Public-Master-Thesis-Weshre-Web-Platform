import SignInInput from "@/components/login_user/input/sign_in/sign_in_input";
import SignContainer from "@/components/Containers/sign_container";
import React from "react";
import { useTranslations } from "next-intl";

export default function SignUp() {
  const t = useTranslations("SignUp");
  return (
    <SignContainer
      container={
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="h-1/4 flex justify-center items-center font-extrabold text-center leading-snug text-2xl lg:text-2xl xl:text-3xl p-[2%]">
            {t("welcome_message")}
          </div>
          <div className="w-full h-3/4">
          <SignInInput />
          </div>
        </div>
      }
    />
  );
}