import React from "react";
import {useLocale} from 'next-intl';

type LoadingDotsProps = {
  size: number;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({size}) => {
  const locale = useLocale();
  const animationCycleDuration = 0.2; 
  const pauseDuration = 1;
  const totalAnimationDuration = 3 * animationCycleDuration + pauseDuration;
  const marginSize = size / 3;
  let textSize: number;

  const circleStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    animationDuration: `${totalAnimationDuration}s`,
    marginLeft: marginSize,
    marginRight: marginSize
  };

  const marginStyle = {
    marginBottom: marginSize,
  };

  let text: string;
  switch (locale) {
    case "en":
      text = "Loading...";
      textSize = Math.floor(size * 0.90);
      break;
    case "fr":
      text = "Chargement...";
      textSize = Math.floor(size * 0.6);
      break;
    default:
      text = "Loading...";
      textSize = Math.floor(size * 0.90);
  }

  const textStyle = {
    fontSize: textSize,
    fontWeight: 'bold',
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
        <div className="flex justify-around items-center"
            style={{ ...marginStyle}}
            >
            <div
            className="animate-dot bg-redWS"
            style={{ ...circleStyle, animationDelay: `-${pauseDuration + 3 * animationCycleDuration}s` }}
            ></div>
            <div
            className="animate-dot bg-blueWS"
            style={{ ...circleStyle, animationDelay: `-${pauseDuration + 2 * animationCycleDuration}s` }}
            ></div>
            <div
            className="animate-dot bg-yellowWS"
            style={{ ...circleStyle, animationDelay: `-${pauseDuration + animationCycleDuration}s` }}
            ></div>
        </div>
        <div className="w-full flex justify-center" style={{ ...textStyle}}>
            {text}
        </div>
    </div>
  );
};

export default LoadingDots;