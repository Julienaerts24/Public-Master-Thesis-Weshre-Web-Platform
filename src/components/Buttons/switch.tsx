import React from "react";
import { Switch } from "@nextui-org/react";

type SwitchWSProps = {
  value: boolean;
  setValue: (value: boolean) => void;
  disable?: boolean;
}

const SwitchWS: React.FC<SwitchWSProps> = ({value, setValue, disable = false}) => {
  return (
    <div className={`flex flex-row`}>
        <Switch size="lg" isSelected={value} onValueChange={setValue} isDisabled={disable}
        classNames={{
            wrapper: "bg-fadeWhite dark:bg-fadeGray",
          }}
          />
    </div>
    
  );
};

export default SwitchWS;


