import React from "react";

type NumberCircleColorProps = {
    title: string;
    value: number;
    subtitleSize: number;
    minSubtitleSize: number;
    maxSubtitleSize: number;
    numberSize: number;
    minNumberSize: number;
    maxNumberSize: number;
    unit: string;
    circleColor: string
}

const NumberCircleColor: React.FC<NumberCircleColorProps> = ({
    title,
    value,
    subtitleSize,
    minSubtitleSize,
    maxSubtitleSize,
    numberSize,
    minNumberSize,
    maxNumberSize,
    unit,
    circleColor,
}) => {

  return (
    <div className="w-full h-full py-1 flex flex-col justify-evenly items-start">
        <div className={"w-full font-medium overflow-hidden line-clamp-1"} style={{fontSize: `clamp(${minSubtitleSize}px, ${subtitleSize}px, ${maxSubtitleSize}px)`}}>
            {title}
        </div>
        <div className="flex flex-row justify-start items-center">
            <div style={{width: `${numberSize}px`, height: `${numberSize}px`, backgroundColor: circleColor, clipPath: "circle()"}}></div>
            <div className={"w-full line-clamp-1 font-bold pt-0 overflow-hidden pl-2"}
                style={{fontSize: `clamp(${minNumberSize}px, ${numberSize}px, ${maxNumberSize}px)`}}>
                {value} {unit}
            </div>
        </div>
    </div>
  );
};

export default NumberCircleColor;