"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingDots from "@/components/Loading";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
  let timeoutId: number | undefined;

  if (user === undefined) {
  } else {
    timeoutId = window.setTimeout(() => {
      if (user.uid == null) {
        router.push("/login");
      } else {
        console.log(user.uid)
        router.push("/myActivities");
      }
    }, 1000);
  }

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, [user]);

    return (
      <div className="flex justify-center items-center h-screen w-full">
        <LoadingDots size={50}/>
      </div>
    );
}