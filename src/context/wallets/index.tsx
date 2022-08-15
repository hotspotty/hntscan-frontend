import { useAppearence } from "context/appearence";
import React, { useCallback, useContext, useMemo, useState } from "react";
import api from "utils/apiService";
import { Hotspot } from "utils/types/hotspots";
import { Validator } from "utils/types/validators";
import { Wallet, WalletListItem } from "utils/types/wallets";

interface Props {
  children: JSX.Element;
}

export type ContextValue = {
  wallets: WalletListItem[];
  currentWallet: Wallet | null;
  setCurrentWallet: React.Dispatch<React.SetStateAction<Wallet | null>>;
  fetchWallets: (page: number) => Promise<void>;
  fetchWalletByUuid: (walletUuid: string) => Promise<void>;
  loading: Loading;
  currentWalletHotspots: Hotspot[];
  setCurrentWalletHotspots: React.Dispatch<React.SetStateAction<Hotspot[]>>;
  currentWalletValidators: Validator[];
  setCurrentWalletValidators: React.Dispatch<React.SetStateAction<Validator[]>>;
  fetchWalletHotspots: (walletUuid: string) => Promise<void>;
  fetchWalletValidators: (walletUuid: string) => Promise<void>;
};

export const WalletsContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const WalletsProvider: React.FC<Props> = (props) => {
  const [wallets, setWallets] = useState<WalletListItem[]>([]);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
  const [currentWalletHotspots, setCurrentWalletHotspots] = useState<Hotspot[]>(
    []
  );
  const [currentWalletValidators, setCurrentWalletValidators] = useState<
    Validator[]
  >([]);
  const [loading, setLoading] = useState<Loading>({
    wallets: false,
    moreWallets: false,
    walletHotspots: false,
    walletValidators: false
  });
  const { setShowGlobalLoading } = useAppearence();

  const fetchWallets = useCallback(
    async (page: number) => {
      if (loading.moreWallets || loading.wallets) return;

      if (page === 0) {
        setWallets([]);
        setLoading((prevState) => ({ ...prevState, wallets: true }));
      }

      if (page > 1) {
        setLoading((prevState) => ({ ...prevState, moreWallets: true }));
        setShowGlobalLoading(true);
      }

      try {
        const response = await api.get(`v1/wallets?page=${page}`);

        setWallets((prevState) => [...prevState, ...response.data]);
        setLoading((prevState) => ({
          ...prevState,
          wallets: false,
          moreWallets: false
        }));
        setShowGlobalLoading(false);
      } catch {
        setLoading((prevState) => ({
          ...prevState,
          wallets: false,
          moreWallets: false
        }));
        setShowGlobalLoading(false);
      }
    },
    [loading.moreWallets, loading.wallets, setShowGlobalLoading]
  );

  const fetchWalletByUuid = useCallback(
    async (walletUuid: string) => {
      try {
        setShowGlobalLoading(true);

        const response = await api.get(`v1/wallets/${walletUuid}`);

        setCurrentWallet(response.data);
        setShowGlobalLoading(false);
      } catch {
        setShowGlobalLoading(false);
      }
    },
    [setShowGlobalLoading]
  );

  const fetchWalletHotspots = useCallback(
    async (walletUuid: string) => {
      if (loading.walletHotspots) return;

      setLoading((prevState) => ({ ...prevState, walletHotspots: true }));

      try {
        const response = await api.get(`v1/wallets/${walletUuid}/hotspots`);

        setCurrentWalletHotspots(response.data);
        setLoading((prevState) => ({ ...prevState, walletHotspots: false }));
      } catch {
        setLoading((prevState) => ({ ...prevState, walletHotspots: false }));
      }
    },
    [loading.walletHotspots]
  );

  const fetchWalletValidators = useCallback(
    async (walletUuid: string) => {
      if (loading.walletValidators) return;

      setLoading((prevState) => ({ ...prevState, walletValidators: true }));

      try {
        const response = await api.get(`v1/wallets/${walletUuid}/validators`);

        setCurrentWalletValidators(response.data);
        setLoading((prevState) => ({ ...prevState, walletValidators: false }));
      } catch {
        setLoading((prevState) => ({ ...prevState, walletValidators: false }));
      }
    },
    [loading.walletValidators]
  );

  const value = useMemo(
    () => ({
      wallets,
      fetchWalletByUuid,
      currentWallet,
      loading,
      fetchWallets,
      setCurrentWallet,
      currentWalletHotspots,
      currentWalletValidators,
      setCurrentWalletHotspots,
      setCurrentWalletValidators,
      fetchWalletHotspots,
      fetchWalletValidators
    }),
    [
      wallets,
      fetchWalletByUuid,
      currentWallet,
      loading,
      fetchWallets,
      currentWalletHotspots,
      currentWalletValidators,
      fetchWalletHotspots,
      fetchWalletValidators,
      setCurrentWalletValidators,
      setCurrentWalletHotspots
    ]
  );

  return <WalletsContext.Provider value={value} {...props} />;
};

export const useWallets = (): ContextValue => {
  const context = useContext(WalletsContext);

  if (context === undefined) {
    throw new Error("useWallets must be used within an WalletsProvider");
  }

  return context;
};

//
// Utils
//

interface Loading {
  wallets: boolean;
  moreWallets: boolean;
  walletHotspots: boolean;
  walletValidators: boolean;
}
