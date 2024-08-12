import React from "react";
import NumberCardIcon from "@/components/Cards/number_card_icon";

const TotalESNCard: React.FC = () => {
  return (
    <div className="h-full w-full">
      <NumberCardIcon title="N° OF BOOKING WITH ESNCARD" number={8741} footer="Participants use an ESNcard"/>
    </div>
  );
};

export default TotalESNCard;
