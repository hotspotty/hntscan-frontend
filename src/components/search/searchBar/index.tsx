import { ArrowLeftIcon, SearchIcon } from "@heroicons/react/solid";
import SearchedItems from "components/search/searchedItems";
import React, { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  placeholder: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onSearch?: (query: string) => void;
  onBlur?: () => void;
  onBack?: () => void;
  withArrowBack?: boolean;
}

const SearchBar: React.FC<Props> = ({
  placeholder,
  search,
  setSearch,
  onSearch,
  onBlur,
  withArrowBack,
  onBack
}) => {
  const [showSearchedItems, setShowSearchedItems] = useState(true);

  const openSearchItems = useCallback(() => {
    setShowSearchedItems(true);
  }, []);

  const onChangeSearch = useDebouncedCallback((query: string) => {
    onSearch && onSearch(query);
  }, 400);

  return (
    <div className="flex w-full relative z-20">
      {showSearchedItems && <SearchedItems className="top-[48px] w-full" />}

      <div className="flex w-full items-center h-11 relative bg-white rounded-md pl-3 pr-2">
        {withArrowBack ? (
          <ArrowLeftIcon onClick={onBack} className="w-5 text-gray-400 mr-2" />
        ) : (
          <SearchIcon className="w-5 text-gray-400 mr-2" />
        )}

        <input
          className="w-full outline-none bg-transparent text-sm border-0 text-gray-800 h-full"
          type="search"
          placeholder={placeholder}
          value={search}
          onBlur={() => {
            setTimeout(() => {
              setShowSearchedItems(false);
              onBlur && onBlur();
            }, 200);
          }}
          onClick={openSearchItems}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            onChangeSearch.call(null, value);
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
