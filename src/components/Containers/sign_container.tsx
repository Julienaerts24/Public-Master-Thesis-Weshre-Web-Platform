'use client'

import React, { useState, useEffect, ReactNode } from "react";
import {Image} from "@nextui-org/react";

type SignContainerProps = {
  container: ReactNode;
};

const SignContainer: React.FC<SignContainerProps> = ({
  container,
}) => {
  const [isWide, setIsWide] = useState(false);
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsWide(window.innerWidth > window.innerHeight);
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-auto">
      {isWide ? (
          <div className="min-h-[540px] min-w-[300px] w-[85%] md:w-[75%] xl:w-[70%] h-[90%] md:h-[80%] xl:h-[75%] rounded-[80px] bg-white dark:bg-darkGray flex z-20">
            <div className="h-full w-[60%] xl:w-[55%] bg-white dark:bg-darkGray rounded-[80px] flex flex-col justify-center items-center px-10 py-4">
              {container}
            </div>
            <div className="w-[40%] xl:w-[45%] bg-redWS rounded-[80px] flex justify-center items-center">
              <div className="p-[20%] flex flex-col justify-center items-center">
                <Image
                  alt="Logo WeShre Blanc"
                  src="/images/weshre_logo_text_blanc.png"
                  height={450}
                  width={450}
                />
              </div>
            </div>
        </div>
      ) : (
        <div className="w-full h-full bg-white dark:bg-darkGray flex flex-col overflow-y-scroll">
          <div className="w-full h-1/3 flex justify-center items-center pt-10 pb-5">
            <Image
              className="w-full object-contain flex justify-center items-center" 
              style={{height: height / 3 - 60, width: width - 80, minHeight: 100}}
              alt="Logo WeShre Blanc"
              src="/images/weshre_logo_color.png"
            />
          </div>
          <div className="h-2/3 min-h-[400px] w-full bg-white dark:bg-darkGray flex flex-col justify-center items-center px-10 py-4">
            {container}
          </div>
      </div>
      )}
    </div>
  );
};

export default SignContainer;
