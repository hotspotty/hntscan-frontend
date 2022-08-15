import { SearchIcon } from "@heroicons/react/solid";
import Blur from "components/blur";
import SearchedItems from "components/search/searchedItems";
import SearchHistory from "components/search/searchHistory";
import React, { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onSearchButtonClick?: () => void;
  onSearch?: (query: string) => void;
}

const Search: React.FC<Props> = ({
  search,
  setSearch,
  onSearchButtonClick,
  onSearch
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const onChangeSearch = useDebouncedCallback((query: string) => {
    onSearch && onSearch(query);
  }, 400);

  const pasteText = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      setSearch(text);
      onChangeSearch.call(null, text);
    });
  }, [onChangeSearch, setSearch]);

  return (
    <div className="flex w-full mobile:p-2 p-4 border border-white rounded-xl backdrop-blur-sm relative max-w-[830px] lg:h-[90px] z-20">
      <Blur className="rounded-xl" />

      {showHistory && !search && <SearchHistory />}

      {(showHistory || search) && (
        <SearchedItems className="top-[88px] w-[calc(100%-24px)]" />
      )}

      <div className="flex w-full items-center mobile:h-14 relative bg-white rounded-lg">
        <input
          className="w-10/12 outline-none bg-white text-sm border-0 text-gray-800 pl-4 pr-6 h-full search-explorer rounded-l-md"
          type="text"
          placeholder="Search transactions, blocks, hotspots, validators and wallets"
          value={search}
          onBlur={() => {
            setTimeout(() => {
              setShowHistory(false);
            }, 200);
          }}
          onClick={() => setShowHistory(true)}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            onChangeSearch.call(null, value);
          }}
        />

        <button
          onClick={() => {
            if (!search) {
              pasteText();
            }

            setSearch(""), onChangeSearch.call(null, "");
          }}
          className="bg-white h-full flex items-center"
        >
          <span className="text-purple-600 font-medium mobile:text-xs text-sm mobile:pr-4 pr-8 cursor-pointer hover:text-purple-700 hover:underline transition-all">
            {!search ? "Paste" : "Clear"}
          </span>
        </button>

        <button
          onClick={() => onSearchButtonClick && onSearchButtonClick()}
          className="bg-purple-600 w-2/12 h-full flex items-center justify-center rounded-r-md hover:bg-purple-700 transition-all"
        >
          <SearchIcon className="w-4 lg:w-6 h-auto" />
        </button>
      </div>
    </div>
  );
};

export default Search;
