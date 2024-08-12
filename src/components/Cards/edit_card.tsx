import React, { useState } from "react";
import { Card, CardBody, Button, Image } from "@nextui-org/react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useTranslations } from "next-intl";

type ListEditProps = {
  height?: number;
};

const ListEdit: React.FC<ListEditProps> = ({ height }) => {
  const t = useTranslations("ListEdit");
  const numberMaxPosibility = 8;
  const userHeight = height == undefined ? 70 : Math.max(height - 60, 70);
  const heightCard = height == undefined ? 60 + numberMaxPosibility * 70 : height;
  const maxDisplayUser = Math.min(
    Math.max(Math.floor(userHeight / 70), 1),
    numberMaxPosibility
  );
  const heightUser = Math.floor(userHeight / maxDisplayUser);
  const paddingTitle = userHeight - heightUser * maxDisplayUser;
  const [open, setOpen] = useState(window.innerWidth >= 768);

  const listItems = [
    {
      key: "general information",
      onPress: () => {},
    },
    { key: "location", onPress: () => {} },
    { key: "photos", onPress: () => {} },
    {
      key: "groups teams",
      onPress: () => {},
    },
    { key: "facilities", onPress: () => {} },
    { key: "requirements", onPress: () => {} },
    { key: "included", onPress: () => {} },
    { key: "listing", onPress: () => {} },
  ];

  const handleAction = (key: React.Key) => {
    const keyString = String(key);
    const item = listItems.find((item) => item.key === keyString);
    if (item) {
      item.onPress();
    }
  };

  return open ? (
    <Card
      className="w-full cursor-default transition-all duration-3000 ease-in-out overflow-hidden"
      style={{
        height: heightCard,
        minHeight: 60 + 70,
        borderRadius: 35,
      }}
    >
      <CardBody
        className={
          "w-full flex flex-col justify-start items-center py-0 px-0 bg-cardColor dark:bg-darkCardColor"
        }
      >
        <div
          className="w-full flex-shrink-0 font-medium text-[30px] flex overflow-hidden"
          style={{ height: 60 + paddingTitle }}
        >
          <Button
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-8 px-4 text-3xl"
            size="lg"
            style={{ borderRadius: 45 }}
            onPress={() => {
              setOpen(false);
            }}
          >
            <div className={`flex w-full items-center }`}>
              <div className={`flex-1 text-center`}>{t("edit")}</div>
              <div className={"justify-self-end"}>
                <Image
                  alt="Card background"
                  src={"/icons/up_arrow_white.svg"}
                  width={30}
                  height={30}
                />
              </div>
            </div>
          </Button>
        </div>
        <div className="w-full h-full overflow-y-auto snap-y snap-proximity mt-0">
          {
            <div className="w-full h-full flex-shrink-1 overflow-y-auto snap-y snap-proximity p-0 m-0">
              {
                <Listbox
                  className="h-full pt-0"
                  aria-label="List Edit Options"
                  onAction={(key) => handleAction(key)}
                >
                  {listItems.map((item) => (
                    <ListboxItem
                      className="snap-start w-full px-5"
                      key={item.key}
                      style={{ height: heightUser - 1.75 }}
                    >
                      <div className="flex flex-row items-center">
                        <div className="inline-block w-2 h-2 bg-black dark:bg-white rounded-full my-0 mr-2 align-middle"></div>
                        <div className="font-bold text-xl">{t(item.key)}</div>
                      </div>
                    </ListboxItem>
                  ))}
                </Listbox>
              }
            </div>
          }
        </div>
      </CardBody>
    </Card>
  ) : (
    <Button
      className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-8 px-4 text-3xl"
      size="lg"
      style={{ borderRadius: 45 }}
      onPress={() => {
        setOpen(true);
      }}
    >
      <div className={`flex w-full items-center }`}>
        <div className={`flex-1 text-center`}>{t("edit")}</div>
        <div className={"justify-self-end"}>
          <Image
            alt="Card background"
            src={"/icons/down_arrow_white.svg"}
            width={30}
            height={30}
          />
        </div>
      </div>
    </Button>
  );
};

export default ListEdit;
