import React from "react";
import { Skeleton } from "@nextui-org/react";

type GroupEventCardSkeletonProps = {
  width: number;
  height: number;
}

const GroupEventCardSkeleton: React.FC<GroupEventCardSkeletonProps> = ({
  width,
  height,
}) => {
   
  const numberOfSkeletons = 18;

  return (
    <div className="w-full h-full overflow-y-hidden mt-3">
      <div className="flex flex-wrap h-full w-full px-5 pb-5">
        {Array.from({ length: numberOfSkeletons }).map((_, index) => (
          <div key={index} className="px-2 sm:px-5 py-3">
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

export default GroupEventCardSkeleton;
