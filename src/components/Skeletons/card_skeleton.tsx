import React from "react";
import { Skeleton } from "@nextui-org/react";

const CardSkeleton: React.FC = ({
}) => {

  return (
    <Skeleton className="flex w-full h-full"
          style={{borderRadius: 35,}}
    />
  );
};

export default CardSkeleton;
