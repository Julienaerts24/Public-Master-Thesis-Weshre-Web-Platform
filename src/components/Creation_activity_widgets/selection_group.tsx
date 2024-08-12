import React, { useState, useEffect } from "react";
import GroupCard from "@/components/Cards/group_card";
import {getGroupsUser, GroupDataType} from "@/services/groupService"
import RedRoundedButton from "@/components/Buttons/rounded_button";
import {useTranslations} from 'next-intl';
import GroupSelectionSkeleton from "@/components/Skeletons/group_selection_skeleton";
import { useAuth } from "@/context/AuthContext";

type SelectionGroupProps = {
  title?: string;
  description?: string
  selected: string[];
  setSelected: (value: string[]) => void;
  multipleSelection: Boolean | undefined;
  minSize?: number;
  disableChange?: boolean;
  errors?: string;
};

const SelectionGroup: React.FC<SelectionGroupProps> = ({
  title = " ",
  description = " ",
  selected,
  setSelected,
  multipleSelection = false,
  minSize = 180,
  errors,
}) => {
  const t = useTranslations('SelectionGroup');
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<GroupDataType[]>([]);
  const [widthAvailable, setWidthAvailable] = useState<number>(window.innerWidth > 1024 ? (window.innerWidth - 88) * 0.7 - 18 : window.innerWidth > 640 ? (window.innerWidth - 88 - 24) - 18 : window.innerWidth - 24 - 18);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setWidthAvailable(window.innerWidth > 1024 ? (window.innerWidth - 88) * 0.7 - 18: window.innerWidth > 640 ? (window.innerWidth - 88 - 24) - 18 : window.innerWidth - 24 - 18);
    };

    const fetchData = async () => {
        try {
          const GroupsDatas = await getGroupsUser(user.uid); 
          if (GroupsDatas != null) {
            setGroups(GroupsDatas);
            setIsLoading(false)
          }
        } catch (error) {
          console.error("Error fetching groups: ", error);
        }
      }

    fetchData()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelection = (key: string) => {
    if (multipleSelection) {
      if (selected.includes(key)) {
        setSelected(selected.filter(item => item !== key));
      } else {
        setSelected([...selected, key]);
      }
    } else {
      setSelected([key]);
    }
  };

  const numberPossibleOneRow = Math.floor((widthAvailable + 16) / (minSize + 16));
  const widthCard = Math.floor(((widthAvailable - ((numberPossibleOneRow - 1) * 16)) / numberPossibleOneRow))
  const shouldWrap = groups.length > numberPossibleOneRow;

  return (
    <div className="w-full flex flex-col items-center">
      <div className={`flex w-full justify-start items-start text-lg lg:text-xl xl:text-2xl font-semibold pb-1 sm:pb-2 ${errors ? "" : ""}`}>
            {title}
        </div>
        <div className={`flex w-full justify-start items-start text-sm lg:text-lg xl:text-xl font-light pb-1 sm:pb-3 ${errors ? "" : ""}`}>
            {description}
        </div>
        {errors && <div className="text-redError text-sm font-bold text-start self-start pb-3">{errors}</div>}
      { isLoading ? 
        <GroupSelectionSkeleton width={widthCard} height={widthCard * 0.8}/> :
        groups.length > 0 ? 
        <div className={`flex flex-row ${shouldWrap ? "flex-wrap justify-center md:justify-start" : "justify-evenly"} h-full w-full gap-4`}>
          {groups.map((group, index) => (
              <div key={group.id} style={{width: widthCard, height: widthCard * 0.8}}>
                  <GroupCard
                      title={group.name}
                      image={group.image}
                      selected={selected !== undefined && selected.includes(group.id)}
                      onPress={() => handleSelection(group.id)}
                  />
              </div>
          ))}
        </div> : 
        <div className="w-full h-full flex flex-col justify-center items-center px-5">
          <div className="text-xl lg:text-2xl xl:text-3xl font-bold pb-5 text-center"> {t('no_group')} </div>
          <RedRoundedButton
            text={t('find_group')}
            sizeText={20}
            onClick={() => {}}
            disabled={true}
          />
        </div>
      }
    </div>
  );
};

export default SelectionGroup;

