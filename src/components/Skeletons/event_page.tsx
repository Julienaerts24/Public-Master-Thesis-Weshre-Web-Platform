import React from "react";
import { Skeleton } from "@nextui-org/react";

type EventPageSkeletonProps = {
  isMdScreen: boolean;  
  width: number;
  height: number;
}

const EventPageSkeleton: React.FC<EventPageSkeletonProps> = ({
  isMdScreen,
  width,
  height,
}) => {

  return (
    <div className="w-full h-full overflow-y-hidden">
    <div
      className="lg:w-[85%] flex flex-col overflow-x-hidden overflow-y-hidden md:overflow-y-hidden pt-2 md:gap-8 md:pt-8 md:pl-8 md:pb-8 lg:ml-[15%] max-md:grid max-md:grid-cols-1 max-md:grid-rows-2"
      style={{
        height: height,
        width: isMdScreen ? "100% - 280px" : "100%",
      }}
    >
      <div className="w-full h-full max-md:pl-8 max-md:pr-8 max-md:py-2 md:pr-0 md:mb-0 max-md:row-span-1">
        <Skeleton
          className="flex w-full h-full"
          style={{
            borderRadius: 35,
          }}
        />
      </div>
      <div className="w-full h-full max-md:pl-8 max-md:pr-8 max-md:py-2 md:pr-0 md:mb-0 max-md:row-span-1">
        <Skeleton
          className="flex w-full h-full"
          style={{
            borderRadius: 35,
          }}
        />
      </div>
    </div>
  </div>
  );
};

export default EventPageSkeleton;
