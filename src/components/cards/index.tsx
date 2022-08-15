import Box from "components/box";
import { InformationIcon } from "components/icons/informations";
import React from "react";

interface Props {
  title: string;
  value: string;
}

const Cards: React.FC<Props> = ({ title, value }) => {
  return (
    <div className="relative h-52 w-full">
      <Box className="flex items-center p-7">
        <>
          <h4 className="flex items-center text-base font-bold">
            {title}
            <span className="ml-3">
              <InformationIcon />
            </span>
          </h4>
          <h3 className="text-3xl font-bold mt-3">{value}</h3>
        </>
      </Box>
    </div>
  );
};

export default Cards;
