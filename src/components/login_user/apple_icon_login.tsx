"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { AiFillApple } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";
import {useResetLoginAtoms} from '@/atoms/atoms';

const AppleLogin: React.FC<{ setError: (error: boolean) => void }> = ({ setError }) => {
  const router = useRouter();
  const { signInWithApple } = useAuth();
  const resetLoginAtoms = useResetLoginAtoms();
  const doResetLoginAtoms = () => {
      resetLoginAtoms(); // made this because can only be called in a function
  };

  const appleButtonClick = async () => {
    const { result, error } = await signInWithApple();
    if (error) {
      setError(true);
      console.error("Apple Sign In Error:", error);
    } else {
      doResetLoginAtoms();
      return router.push("/myActivities");
    }
  };
  return (
    <>
      <button
        aria-label="Apple Button Connexion"
        className="text-2xl md:text-3xl lg:text-4xl pt-[5%] px-[8%] cursor-pointer transform transition-transform duration-300 hover:scale-125"
        onClick={appleButtonClick}
      >
        <AiFillApple />
      </button>
    </>
  );
};

export default AppleLogin;
