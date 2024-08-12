import React from "react";
import { Progress, Tooltip } from "@nextui-org/react";

type VerticalProgressBarProps = {
  currentValue: number;
  maxValue: number;
  label: string;
  height: number;
  unit: string;
};

const VerticalProgressBar: React.FC<VerticalProgressBarProps> = ({
  currentValue,
  maxValue,
  label,
  height,
  unit,
}) => {
  return (
    <div className="w-5 flex flex-col justify-center items-center">
      <div className="flex justify-center items-center" style={{ height: height - 28 }}>
        <div
          className="h-5"
          style={{ width: height - 20, transform: "rotate(-90deg)" }}
        >
          <Tooltip
            offset={- ((height - 20) * (((maxValue * 1.1) - (currentValue + 0.1 * maxValue)) / (maxValue * 1.1)))} // Put the number exactly on top of the bar
            color={"default"}
            placement={"top"}
            delay={100}
            content={<div className="font-bold">{currentValue} {unit}</div>}
          >
            <Progress
              aria-label={label}
              value={currentValue + 0.1 * maxValue} // Add constant value so that there is not just nothing when value = 0
              size="lg"
              maxValue={maxValue * 1.1}
              color="primary"
              classNames={{ track: "bg-transparent" }}
            />
          </Tooltip>
        </div>
      </div>
      <div className="h-7 font-semibold text-xs md:text-small pt-2">{label}</div>
    </div>
  );
};

export default VerticalProgressBar;
