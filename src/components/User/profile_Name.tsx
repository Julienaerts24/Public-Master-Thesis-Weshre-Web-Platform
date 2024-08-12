import React from "react";
import { User } from "@nextui-org/react";
import { UserInfo } from '@/services/eventService';

type ProfileNameProps = {
    userInfo: UserInfo;
    size: "lg" | "base" | "sm";
};

const ProfileName: React.FC<ProfileNameProps> = ({ userInfo, size }) => {
    const sizeAvatar = size == "lg" ? "lg" : "md";
    return (
        <User
            name={userInfo.name}
            isFocusable={true}
            aria-label={userInfo.uid}
            avatarProps={{
                src: userInfo.photo,
                size: sizeAvatar,
                radius: "md",
                className: 'shrink-0 cursor-default'
            }}
            classNames={{
                name: `font-bold cursor-default whitespace-normal text-${size}`,
            }}
        />
    );
};

export default ProfileName;
