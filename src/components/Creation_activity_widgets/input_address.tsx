import React from "react";
import Map from "@/components/Inputs/map_input";
import { MapInputProps } from "@/components/Inputs/map_input"  

const InputAddress: React.FC<MapInputProps> = ({
  address,
  setAddress,
  errors,
  disableChange,
}) => {
  return (
    <div className="w-full h-full shrink-0 flex justify-center items-center rounded-3xl">
      <div className="w-full h-full">
        <Map 
          address={address}
          setAddress={setAddress}
          errors={errors}
          disableChange={disableChange}
        />
      </div>
    </div>
  );
}

export default InputAddress;