"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { ImGoogle3 } from "react-icons/im";
import { useAuth } from "@/context/AuthContext";
import {useResetLoginAtoms} from '@/atoms/atoms';

const GoogleLogin: React.FC<{ setError: (error: boolean) => void }> = ({ setError }) => {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const resetLoginAtoms = useResetLoginAtoms();
  const doResetLoginAtoms = () => {
      resetLoginAtoms(); // made this because can only be called in a function
  };

  const googleButtonClick = async () => {
    const { result, error } = await signInWithGoogle();
    if (error) {
      setError(true);
      console.error("Google Sign In Error:", error);
    } else {
      doResetLoginAtoms();
      return router.push("/myActivities");
    }
  };
  return (
    <>
      <button
        aria-label="Google Button Connexion"
        className="text-2xl md:text-3xl lg:text-4xl pt-[5%] px-[8%] cursor-pointer transform transition-transform duration-300 hover:scale-125"
        onClick={googleButtonClick}
      >
        <ImGoogle3 />
      </button>
    </>
  );
};

export default GoogleLogin;