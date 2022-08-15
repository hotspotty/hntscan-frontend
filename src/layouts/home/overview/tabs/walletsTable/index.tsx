import BlockLink from "components/blockLink";
import Table from "components/table";
import WalletLink from "components/walletLink";
import { useWallets } from "context/wallets";
import { processBonesBalance } from "layouts/wallet/overview";
import React, { useCallback, useMemo, useRef } from "react";
import formatLargeNumber from "utils/formatLargeNumber";
import useMount from "utils/useMount";

const WalletsTable: React.FC = () => {
  const { wallets, fetchWallets, loading } = useWallets();
  const currentPage = useRef(0);

  useMount(() => {
    fetchWallets(currentPage.current);
    currentPage.current++;

    window.addEventListener("scroll", loadMore);

    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  });

  const loadMore = useCallback(() => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      fetchWallets(currentPage.current);
      currentPage.current++;
    }
  }, [fetchWallets]);

  const data = useMemo(
    () =>
      wallets.map((account) => ({
        id: <WalletLink walletAddress={account.address} />,
        last_block: <BlockLink blockHeight={account.last_block} />,
        hnt_balance: `${formatLargeNumber(
          processBonesBalance(account.balance.hnt)
        )} HNT`,
        mobile_balance: `${formatLargeNumber(
          processBonesBalance(account.balance.mobile)
        )} MOBILE`,
        dc_balance: `${formatLargeNumber(account.balance.dc)} DC`,
        hst_balance: `${formatLargeNumber(
          processBonesBalance(account.balance.hst)
        )} HST`,
        hotspots: account.hotspot_count,
        validators: account.validator_count
      })),
    [wallets]
  );

  return (
    <>
      <div className="mb-6">
        The wallets below are ordered by recent on-chain activity.
      </div>
      <Table head={header} data={data} loading={loading.wallets} />
    </>
  );
};

export default WalletsTable;

//
// Utils
//

const header = [
  {
    key: "id",
    hiddenTitle: false,
    title: "Wallet Adress"
  },
  {
    key: "last_block",
    hiddenTitle: false,
    title: "Last block"
  },
  {
    key: "hotspots",
    hiddenTitle: false,
    title: "Hotspots"
  },
  {
    key: "validators",
    hiddenTitle: false,
    title: "Validators"
  },
  {
    key: "hnt_balance",
    hiddenTitle: false,
    title: "HNT Balance"
  },
  {
    key: "mobile_balance",
    hiddenTitle: false,
    title: "MOBILE Balance"
  },
  {
    key: "dc_balance",
    hiddenTitle: false,
    title: "DC Balance"
  },
  {
    key: "hst_balance",
    hiddenTitle: false,
    title: "HST Balance"
  }
];
