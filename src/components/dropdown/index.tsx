import { ChevronDownIcon } from "@heroicons/react/solid";
import Blur from "components/blur";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction } from "react";
import classNames from "utils/className";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  items: { name: string; href?: string }[];
  title?: string;
  dark?: boolean;
  isLink: boolean;
}

const Dropdown: React.FC<Props> = ({ open, setOpen, items, title, dark }) => {
  const router = useRouter();

  return (
    <div className="relative w-full h-full flex justify-center z-[30]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center cursor-pointer w-full h-full justify-center"
      >
        <span
          className={classNames(
            "mobile:text-xs text-sm font-medium mr-1",
            dark ? "text-white" : "text-gray-500"
          )}
        >
          {title}
        </span>

        <ChevronDownIcon
          color={dark ? "#fff" : "#4B5563"}
          className={classNames(
            "w-5 mobile:w-4 flex-shrink-0 transition-all",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className={classNames(
            "absolute rounded-md min-w-[224px] z-10 overflow-hidden",
            dark ? "right-0 top-10" : "-left-4 top-[65px]"
          )}
        >
          {dark ? (
            <Blur />
          ) : (
            <div className="bg-white absolute w-full h-full left-0 top-0 z-0"></div>
          )}

          <ul className="w-full border border-white rounded-md flex flex-col">
            {items.map((item, index) => (
              <button
                key={index}
                className={classNames(
                  "w-full flex items-center px-4 py-2 relative font-normal mobile:text-xs text-sm group-hover:text-gray-500",
                  dark
                    ? "text-white hover:text-gray-500 hover:bg-gray-100 "
                    : "text-gray-500 hover:text-gray-500 hover:bg-purple-50"
                )}
                onClick={() => router.push(`/${item.href}`)}
              >
                {item.name}
              </button>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
