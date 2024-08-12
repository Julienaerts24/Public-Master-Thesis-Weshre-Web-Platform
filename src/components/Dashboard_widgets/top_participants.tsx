import React, { useState, useEffect, useRef } from "react";
import ListProfile from "@/components/User/list_profile";
import { useTranslations } from "next-intl";
import { UserInfo } from "@/services/eventService";

type TopParticipantsCardProps = {
  listUserInfo: UserInfo[] | undefined;
};

const TopParticipantsCard: React.FC<TopParticipantsCardProps> = ({ listUserInfo }) => {
  const t = useTranslations("MyDashboard");
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setCardHeight(entry.contentRect.height);
        setCardWidth(entry.contentRect.width);
      }
    });
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="h-full w-full" ref={cardRef}>
      <ListProfile
          title={t("top_participants")}
          height={cardHeight}
          width={cardWidth}
          listUserInfo={listUserInfo == undefined ? [] : listUserInfo}
          isLoading={listUserInfo == undefined}
          needSorted={false}
          unitData={t("unitTicket")}
      />
    </div>
  );
};

export default TopParticipantsCard;