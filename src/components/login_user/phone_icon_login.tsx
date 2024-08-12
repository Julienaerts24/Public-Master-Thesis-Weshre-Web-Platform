"use client"

import React from "react";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { useAtom } from "jotai";
import { LoginStateAtom } from "@/atoms/atoms";

const PhoneLogin: React.FC = () => {
  const [LoginState, setLoginState] = useAtom(LoginStateAtom);

  const phoneButtonClick = () => {
    LoginState == "EmailPassword"
      ? setLoginState("PhoneNumber")
      : setLoginState("EmailPassword");
  };

  return (
    <>
      <button
        aria-label="Phone Button Connexion"
        className="text-2xl md:text-3xl lg:text-4xl pt-[5%] px-[8%] cursor-pointer transform transition-transform duration-300 hover:scale-125"
        onClick={phoneButtonClick}
      >
        {LoginState != "EmailPassword" ? <MdAlternateEmail /> : <FaPhoneSquareAlt />}
      </button>
    </>
  );
};

export default PhoneLogin;
