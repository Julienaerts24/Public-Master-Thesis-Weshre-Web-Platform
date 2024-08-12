import React from "react";
import { CircularProgress } from "@nextui-org/react";

type ProgressCircleLabeledProps = {
  value: number;
  label: string;
  size: number;
}

const ProgressCircleLabeled: React.FC<ProgressCircleLabeledProps> = ({
    value, 
    label, 
    size
}) => {
  const sizeAvailable = [300, 200, 150, 100, 72, 60, 50, 40];
  const adjustedSize = sizeAvailable.find(s => s <= size) || sizeAvailable[sizeAvailable.length - 1];
  return (
    <CircularProgress
    label={label}
    aria-label={label}
    value={value}
    color="primary"
    showValueLabel={true}
    classNames={{
    svg: `w-[${adjustedSize}px] h-[${adjustedSize}px]`,
    value: adjustedSize >= 200 ? "text-4xl font-semibold" : adjustedSize >= 150 ? "text-3xl font-semibold" : adjustedSize >= 120 ? "text-xl font-semibold" : adjustedSize >= 72 ? "text-lg font-semibold" : adjustedSize >= 50 ? "text-sm font-semibold" : "text-xs font-semibold",
    label: adjustedSize >= 150 ? "text-3xl font-semibold" : "text-xl font-semibold",
    }}
    />
  );
};

export default ProgressCircleLabeled;