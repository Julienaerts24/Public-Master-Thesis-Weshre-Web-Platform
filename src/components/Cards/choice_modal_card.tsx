import React, {useState} from "react";
import { Card } from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";
import CircleIconButton from "@/components/Buttons/circle_icon_button";

type LanguagesCodeCardProps = {
  code: string;
  name: string;
  icon?: string;
  useKeyInSearch?: boolean;
  onPress: () => void;
  selected?: boolean;
  onDelete?: (value: string) => void;
  cardDisplay?: boolean;
  isDeletable?: boolean;
};

const LanguagesCodeCard: React.FC<LanguagesCodeCardProps> = ({
  name,
  code,
  icon,
  useKeyInSearch = false,
  onPress,
  selected = false,
  cardDisplay = true,
  onDelete = () => {},
  isDeletable = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative max-sm:w-full"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      >
      <Card
        isPressable={!cardDisplay}
        className={`shadow-sm p-0.5 ${selected ? " text-redWS" : ""} ${cardDisplay ? "bg-white dark:bg-darkGray rounded-3xl max-sm:w-full" : "w-full bg-white dark:bg-darkGray"}`}
        onPress={onPress}
      >
        <div className={`w-full h-full ${ cardDisplay ? "flex flex-row justify-around" : "flex flex-row justify-center" } items-center p-2 px-4 gap-4`}>
          {useKeyInSearch ? <div className={`${cardDisplay ? "max-sm:w-16 flex justify-center" : "w-16"} font-semibold text-base lg:text-lg xl:text-xl`}>
            {code.toUpperCase()}
          </div> : <div className={`${cardDisplay ? "max-sm:w-16 flex justify-center" : "w-16"} font-semibold text-lg lg:text-xl xl:text-2xl`}>
            {icon}
          </div>
          }
          <div className={`${cardDisplay ? "max-sm:w-full max-sm:text-start max-sm:line-clamp-2" : "w-full text-start line-clamp-2"} font-semibold text-lg lg:text-xl xl:text-2xl`}>
            {name}
          </div>
          { !cardDisplay &&
            <div className="w-4 text-redWS">
             {selected && <FaCheck />}
            </div>
            }
        </div>
      </Card>
      { cardDisplay && isDeletable &&
        <div className={`absolute right-[-5px] top-[-5px] z-20 max-md:opacity-100 max-md:visible transition-opacity duration-1000 ${isHovered ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <CircleIconButton
            circleSize={25}
            iconSize={18}
            circleColor="#ff5757"
            iconFileAddress="/icons/cross_white.svg"
            onClick={() => onDelete(code)}
            responsiveness={5}
          />
        </div>
      }
    </div>
  );
};

export default LanguagesCodeCard;