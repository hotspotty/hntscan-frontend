import { AnyTransaction } from "@helium/http";
import { useAppearence } from "context/appearence";
import { head } from "lodash";
import React, { useCallback, useContext, useMemo, useState } from "react";
import api from "utils/apiService";
import { Block } from "utils/types/blocks";

interface Props {
  children: JSX.Element;
}

export type ContextValue = {
  blocks: Block[];
  fetchBlocks: (page: number) => Promise<void>;
  fetchBlockByHeight: (height: string) => Promise<void>;
  currentBlock: Block | undefined;
  blockTransactions: AnyTransaction[];
  loading: Loading;
};

export const BlocksContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const BlocksProvider: React.FC<Props> = (props) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block>();
  const [blockTransactions, setBlockTransactions] = useState<AnyTransaction[]>(
    []
  );
  const [loading, setLoading] = useState<Loading>({
    blocks: false,
    moreBlocks: false,
    blockByHeight: false,
    blockTransactions: false,
    moreBlockTransactions: false
  });
  const { setShowGlobalLoading } = useAppearence();

  const fetchBlocks = useCallback(
    async (page: number) => {
      if (loading.moreBlocks || loading.blocks) return;

      if (page === 0) {
        setBlocks([]);
        setLoading((prevState) => ({ ...prevState, blocks: true }));
      }

      if (page > 1) {
        setLoading((prevState) => ({ ...prevState, moreBlocks: true }));
        setShowGlobalLoading(true);
      }

      try {
        const response = await api.get(`v1/blocks?page=${page}`);

        setBlocks((prevState) => [...prevState, ...response.data]);
        setLoading((prevState) => ({
          ...prevState,
          blocks: false,
          moreBlocks: false
        }));
        setShowGlobalLoading(false);
      } catch {
        setLoading((prevState) => ({
          ...prevState,
          blocks: false,
          moreBlocks: false
        }));
        setShowGlobalLoading(false);
      }
    },
    [loading.blocks, loading.moreBlocks, setShowGlobalLoading]
  );

  const fetchBlockByHeight = useCallback(
    async (height: string) => {
      setLoading((prevState) => ({ ...prevState, blockByHeight: true }));
      setShowGlobalLoading(true);
      try {
        const response = await api.get(`v1/blocks/${height}`);

        setCurrentBlock(head(response.data));
        setLoading((prevState) => ({ ...prevState, blockByHeight: false }));
        setShowGlobalLoading(false);
      } catch {
        setLoading((prevState) => ({ ...prevState, blockByHeight: false }));
        setShowGlobalLoading(false);
      }
    },
    [setShowGlobalLoading]
  );

  const value = useMemo(
    () => ({
      blocks,
      fetchBlocks,
      loading,
      fetchBlockByHeight,
      currentBlock,
      blockTransactions
    }),
    [
      blocks,
      fetchBlocks,
      loading,
      fetchBlockByHeight,
      currentBlock,
      blockTransactions
    ]
  );

  return <BlocksContext.Provider value={value} {...props} />;
};

export const useBlocks = (): ContextValue => {
  const context = useContext(BlocksContext);

  if (context === undefined) {
    throw new Error("useBlocks must be used within an BlocksProvider");
  }

  return context;
};

//
// Utils
//

interface Loading {
  blocks: boolean;
  moreBlocks: boolean;
  blockByHeight: boolean;
  blockTransactions: boolean;
  moreBlockTransactions: boolean;
}
