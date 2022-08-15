import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import api from "utils/apiService";
import { Block } from "utils/types/blocks";
import { Hotspot } from "utils/types/hotspots";
import { Transaction } from "utils/types/transactions";
import { Validator } from "utils/types/validators";
import { Wallet } from "utils/types/wallets";

interface Props {
  children: JSX.Element;
}

export type ContextValue = {
  historyItems: HistoryItem[];
  searchedItems: SearchResponse[] | null;
  setSearchedItems: React.Dispatch<React.SetStateAction<SearchResponse[] | null>>;
  searchItemByQuery: (query: string) => Promise<null | undefined>;
  handleHistoryItem: (item: SearchResponse) => void;
  loadingSearch: boolean;
};

export const ExplorerContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const ExplorerProvider: React.FC<Props> = (props) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [searchedItems, setSearchedItems] = useState<SearchResponse[] | null>(
    null
  );
  const [loadingSearch, setloadingSearch] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setHistoryItems(JSON.parse(localStorage.getItem("searchHistory") || "[]"));
  }, []);

  const redirectPage = useCallback(
    (data: SearchResponse) => {
      switch (data.data_type) {
        case "hotspot":
          return router.push(`/blockchain/hotspots/${data.address}`);
        case "wallet":
          return router.push(`/blockchain/wallets/${data.address}`);
        case "block":
          return router.push(`/blockchain/blocks/${data.height}`);
        case "transaction":
          return router.push(`/blockchain/transactions/${data.hash}`);
        case "validator":
          return router.push(`/blockchain/validators/${data.address}`);
      }
    },
    [router]
  );

  const handleHistoryItem = useCallback(
    (item: SearchResponse) => {
      const currentItem = {
        type: item.data_type,
        id: "",
        data: item
      };

      if (
        item.data_type === "hotspot" ||
        item.data_type === "validator" ||
        item.data_type === "wallet"
      ) {
        currentItem.id = item.address;
      }

      if (item.data_type === "block") {
        currentItem.id = item.height.toString();
      }

      if (item.data_type === "transaction") {
        currentItem.id = item.hash;
      }

      setHistoryItems((prevState) => {
        if (
          prevState.find((historyItem) => historyItem.id === currentItem.id)
        ) {
          return prevState;
        }

        const newHistoryItems = [currentItem, ...prevState];

        localStorage.setItem("searchHistory", JSON.stringify(newHistoryItems));

        return newHistoryItems;
      });

      redirectPage(item);
      setSearchedItems(null);
    },
    [redirectPage]
  );

  const searchItemByQuery = useCallback(async (query: string) => {
    if (controller) controller.abort();

    controller = new AbortController();
    const signal = controller.signal;

    setSearchedItems(null);

    if (!query) return null;

    setloadingSearch(true);

    try {
      const response: AxiosResponse<SearchResponse[]> = await api.get(
        `v1/search/${query}`,
        { signal }
      );

      setSearchedItems(response.data);
      setloadingSearch(false);
    } catch {
      setloadingSearch(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      historyItems,
      searchItemByQuery,
      handleHistoryItem,
      searchedItems,
      loadingSearch,
      setSearchedItems
    }),
    [
      historyItems,
      searchItemByQuery,
      handleHistoryItem,
      searchedItems,
      loadingSearch,
      setSearchedItems
    ]
  );

  return <ExplorerContext.Provider value={value} {...props} />;
};

export const useExplorer = (): ContextValue => {
  const context = useContext(ExplorerContext);

  if (context === undefined) {
    throw new Error("useExplorer must be used within an ExplorerProvider");
  }

  return context;
};

//
// Utils
//

export interface HistoryItem {
  type: string;
  id: string;
  data: SearchResponse;
}

export type SearchResponse = Hotspot | Wallet | Block | Transaction | Validator;

let controller: AbortController | null = null;
