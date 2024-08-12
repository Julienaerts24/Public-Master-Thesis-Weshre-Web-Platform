'use client'

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingDots from "@/components/Loading";

const EditRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/myActivities/newActivity");
  }, [router]);

  return (
    <div className="h-full w-full flex justify-center items-center">
      <LoadingDots size={50} />
    </div>
  );
};

export default EditRedirect;
