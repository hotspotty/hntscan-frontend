import { HistoryItem, useExplorer } from "context/explorer/index";
import { isEmpty } from "lodash";
import React, { useMemo, useState } from "react";
import classNames from "utils/className";
import { getLabel } from "../searchedItems";

const SearchHistory: React.FC = () => {
  const [historySearch, setHistorySearch] = useState("");
  const { historyItems, handleHistoryItem } = useExplorer();

  const filteredItems = useMemo(
    () =>
      historyItems.filter((item: HistoryItem) =>
        item.id?.toLowerCase().includes(historySearch.toLowerCase())
      ),
    [historySearch, historyItems]
  );

  if (isEmpty(historyItems)) return null;

  return (
    <div className="bg-white w-[calc(100%-24px)] shadow-3xl absolute top-[88px] rounded-md overflow-hidden mobile:hidden">
      <div className="border-b border-gray-300 absolute mr-4 w-[calc(100%-20px)]">
        <input
          className="h-12 w-full pl-5 font-normal text-gray-800 text-base"
          placeholder="Search history"
          onChange={(e) => setHistorySearch(e.target.value)}
        />
      </div>

      <div className="overflow-y-auto max-h-[403px] pt-12 history-search">
        {filteredItems.map(({ data }, index) => {
          const label = getLabel(data);
          if (!label) return;
          return (
            <span
              key={index}
              className="flex items-center cursor-pointer hover:bg-gray-100 px-5 py-4"
              onClick={() => {
                handleHistoryItem(data);
              }}
            >
              <div className="flex flex-col items-start">
                <span className="text-gray-800 text-sm font-medium">
                  {label.title}
                </span>

                {label.description && (
                  <span className="text-gray-500 text-sm font-medium">
                    {label.description}
                  </span>
                )}
              </div>
              <span
                className={classNames(
                  "text-white capitalize px-2 py-1 text-xs font-medium rounded-md mb-1 ml-auto",
                  label.color
                )}
              >
                {label.tag}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SearchHistory;
