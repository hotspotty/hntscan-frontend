import { AxiosResponse } from "axios";
import { useAppearence } from "context/appearence";
import { head } from "lodash";
import React, { useCallback, useContext, useMemo, useState } from "react";
import api from "utils/apiService";
import {
  Rewards,
  Transaction,
  TransactionResponse
} from "utils/types/transactions";
interface Props {
  children: JSX.Element;
}

export type ContextValue = {
  transactions: Transaction[];
  fetchTransactions: (page: number) => Promise<void>;
  loading: Loading;
  fetchTransactionByUuid: (transactionUuid: string) => Promise<void>;
  currentTransaction: Transaction | null;
  setCurrentTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  setCurrentTransactionDetails: React.Dispatch<
    React.SetStateAction<TransactionResponse | null>
  >;
  currentTransactionDetails: TransactionResponse | null;
  fetchTxnsRewards: (transactionUuid: string, page: number) => Promise<void>;
  txnsRewards: Rewards[];
  setTxnsRewards: React.Dispatch<React.SetStateAction<Rewards[]>>;
};

export const TransactionsContext = React.createContext<
  ContextValue | undefined
>(undefined);

export const TransactionsProvider: React.FC<Props> = (props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);
  const [currentTransactionDetails, setCurrentTransactionDetails] =
    useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState<Loading>({
    transactions: false,
    moreTransactions: false,
    txnsRewards: false
  });
  const [txnsRewards, setTxnsRewards] = useState<Rewards[]>([]);
  const { setShowGlobalLoading } = useAppearence();

  const fetchTransactions = useCallback(
    async (page: number) => {
      if (loading.transactions || loading.moreTransactions) return;

      if (page === 0) {
        setTransactions([]);
        setLoading((prevState) => ({ ...prevState, transactions: true }));
      }

      if (page > 1) {
        setLoading((prevState) => ({ ...prevState, moreTransactions: true }));
        setShowGlobalLoading(true);
      }

      try {
        const response = await api.get(`v1/transactions?page=${page}`);

        setTransactions((prevState) => [...prevState, ...response.data]);
        setLoading((prevState) => ({
          ...prevState,
          transactions: false,
          moreTransactions: false
        }));
        setShowGlobalLoading(false);
      } catch {
        setLoading((prevState) => ({
          ...prevState,
          transactions: false,
          moreTransactions: false
        }));
        setShowGlobalLoading(false);
      }
    },
    [loading.moreTransactions, loading.transactions, setShowGlobalLoading]
  );

  const fetchTransactionByUuid = useCallback(
    async (transactionUuid: string) => {
      setShowGlobalLoading(true);
      try {
        const response: AxiosResponse<Transaction[]> = await api.get(
          `v1/transactions/${transactionUuid}`
        );

        const txData = head(response.data) as Transaction;

        setCurrentTransaction(txData);

        setCurrentTransactionDetails(() => {
          const newState = JSON.parse(txData.fields);
          if (
            txData.type === "poc_receipts_v2" ||
            txData.type === "poc_receipts_v1"
          ) {
            return {
              ...newState,
              data_type: txData.type,
              path: newState.path[0]
            };
          }

          return { ...newState, data_type: txData.type };
        });

        setShowGlobalLoading(false);
      } catch {
        setShowGlobalLoading(false);
      }
    },
    [setShowGlobalLoading]
  );

  const fetchTxnsRewards = useCallback(
    async (transactionUuid: string, page: number) => {
      setLoading((prevState) => ({ ...prevState, txnsRewards: true }));

      try {
        const response: AxiosResponse<Rewards[]> = await api.get(
          `v1/transactions/${transactionUuid}/rewards?limit=20&page=${page}`
        );

        if (!response.data) return;

        setTxnsRewards((prevState) => [...prevState, ...response.data]);
        setLoading((prevState) => ({ ...prevState, txnsRewards: false }));
      } catch {
        setLoading((prevState) => ({ ...prevState, txnsRewards: false }));
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      transactions,
      fetchTransactions,
      loading,
      fetchTransactionByUuid,
      currentTransaction,
      currentTransactionDetails,
      fetchTxnsRewards,
      txnsRewards,
      setTxnsRewards,
      setCurrentTransaction,
      setCurrentTransactionDetails
    }),
    [
      transactions,
      fetchTransactions,
      loading,
      fetchTransactionByUuid,
      currentTransaction,
      currentTransactionDetails,
      fetchTxnsRewards,
      txnsRewards,
      setTxnsRewards,
      setCurrentTransaction,
      setCurrentTransactionDetails
    ]
  );

  return <TransactionsContext.Provider value={value} {...props} />;
};

export const useTransactions = (): ContextValue => {
  const context = useContext(TransactionsContext);

  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within an TransactionsProvider"
    );
  }

  return context;
};

//
// Utils
//

interface Loading {
  transactions: boolean;
  moreTransactions: boolean;
  txnsRewards: boolean;
}
