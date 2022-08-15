import Box from "components/box";
import { LineTabItem } from "components/lineTabs";
import React from "react";

interface Props {
  options: string[] | LineTabItem[];
  setCurrent: (item: string) => void;
}

const MobileSelect: React.FC<Props> = ({ options, setCurrent }) => {
  return (
    <div className="relative lg:hidden">
      <Box className="py-2">
        <select
          onChange={(e) => setCurrent(e.target.value)}
          className="bg-transparent w-full text-xs"
        >
          {options.map((item, index) => (
            <option
              key={index}
              value={typeof item === "string" ? item : item.key}
            >
              {typeof item === "string" ? item : item.title}
            </option>
          ))}
        </select>
      </Box>
    </div>
  );
};

export default MobileSelect;
