import React from "react";

type InfoProps = {
  title?: string;
  description?: string;
};

const Info: React.FC<InfoProps> = ({
  title = "",
  description = "",
}) => {

  return (
    <div className="w-full flex flex-col px-5 pb-3">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="w-full flex flex-col">
          <div className="text-lg lg:text-xl xl:text-2xl font-semibold">{title}</div>
          <div className="text-sm lg:text-lg xl:text-xl font-light">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default Info;
