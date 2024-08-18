import React from "react";
import { Input } from "@nextui-org/react";
import {useTranslations} from 'next-intl';
import { IoSearchSharp } from "react-icons/io5";

type ResearchInputProps = {
    search: string;
    setSearch: (value: string) => void;
    size: ("sm" | "md" | "lg");
}

const ResearchInput: React.FC<ResearchInputProps> = ({
    search,
    setSearch,
    size,
}) => {
  const t = useTranslations('ResearchInput');

  return (
    <div className="w-full h-full flex justify-center items-end"
    >
      <Input
        id={"search"}
        value={search}
        onValueChange={setSearch}
        variant="bordered"
        isClearable
        size={size}
        radius="full"
        aria-label="search"
        classNames={{
          label: "text-black dark:text-white",
          inputWrapper:
            "border-0 text-black dark:text-white bg-default/50 dark:bg-default/50 hover:bg-default/50 dark:hover:bg-default/50 ",
        }}
        placeholder={t("research")}
        startContent={<IoSearchSharp />}
      />
    </div>
  );
};

export default ResearchInput;
