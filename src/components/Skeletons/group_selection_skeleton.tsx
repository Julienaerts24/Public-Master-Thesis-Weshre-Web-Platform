import React from "react";
import { Skeleton } from "@nextui-org/react";

type GroupSelectionSkeletonProps = {
  width: number;
  height: number;
}

const GroupSelectionSkeleton: React.FC<GroupSelectionSkeletonProps> = ({
  width,
  height,
}) => {
   
  const numberOfSkeletons = 18;

  return (
    <div className="w-full h-full overflow-y-hidden">
      <div className="flex flex-wrap h-full w-full gap-4">
        {Array.from({ length: numberOfSkeletons }).map((_, index) => (
          <div key={index} className="">
            <Skeleton
              className="flex"
              style={{
                width: width,
                height: height,
                borderRadius: 35,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupSelectionSkeleton;
/*
{ groups.length > 0 ? <div className={`flex flex-row ${shouldWrap ? "flex-wrap justify-start" : "justify-evenly"} h-full w-full gap-4`}>
*/