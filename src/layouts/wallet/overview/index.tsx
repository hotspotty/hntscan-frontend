import { useStatistics } from "context/statistics/index";
import { useWallets } from "context/wallets";
import { values } from "lodash";
import React, { useMemo } from "react";
import formatLargeNumber from "utils/formatLargeNumber";
import formatterUsd from "utils/formatterUsd";
import { BONES_PER_HNT } from "utils/types/global";

const WalletBalanceOverview: React.FC = () => {
  const { currentWallet } = useWallets();
  const { stats } = useStatistics();

  const hntRewards = useMemo(() => {
    if (!currentWallet?.rewards) return 0;

    return processBonesBalance(
      values(currentWallet?.rewards).reduce((a: number, b: number) => a + b, 0)
    );
  }, [currentWallet?.rewards]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-10">
      <div className="mt-6 mr-20">
        <h4 className="text-sm text-gray-300">HNT Balance</h4>
        <h4 className="mobile:text-xl text-2xl font-bold my-1 flex items-center">
          {formatLargeNumber(processBonesBalance(currentWallet?.balance.hnt))}{" "}
          HNT
        </h4>
        <span className="flex text-xs font-bold text-gray-300">
          {formatterUsd(
            processBonesBalance(currentWallet?.balance.hnt) *
              (stats?.hnt_price.price || 0)
          )}
        </span>
      </div>

      <div className="mt-6 mr-20">
        <h4 className="text-sm text-gray-300">MOBILE Balance</h4>
        <h4 className="mobile:text-xl text-2xl font-bold my-1 flex items-center">
          {formatLargeNumber(
            processBonesBalance(currentWallet?.balance.mobile)
          )}{" "}
          MOBILE
        </h4>
      </div>

      <div className="mt-6 mr-20">
        <h4 className="text-sm text-gray-300">HST Balance</h4>
        <h4 className="mobile:text-xl text-2xl font-bold my-1 flex items-center">
          {formatLargeNumber(processBonesBalance(currentWallet?.balance.hst))}{" "}
          HST
        </h4>
      </div>

      <div className="mt-6 mr-20">
        <h4 className="text-sm text-gray-300">DC Balance</h4>
        <h4 className="mobile:text-xl text-2xl font-bold my-1 flex items-center">
          {formatLargeNumber(currentWallet?.balance.dc)} DC
        </h4>
        <span className="flex text-xs font-bold text-gray-300">
          {formatterUsd((currentWallet?.balance.dc || 0) * 0.00001)}
        </span>
      </div>

      <div className="mt-6 mr-20">
        <h4 className="text-sm text-gray-300">Staked HNT</h4>
        <h4 className="mobile:text-xl text-2xl font-bold my-1 flex items-center">
          {formatLargeNumber(processBonesBalance(currentWallet?.balance.stake))}{" "}
          HNT
        </h4>
        <span className="flex text-xs font-bold text-gray-300">
          {formatterUsd(
            processBonesBalance(currentWallet?.balance.stake) *
              (stats?.hnt_price.price || 0)
          )}
        </span>
      </div>

      <div className="mt-6 mr-20">
        <h4 className="text-sm text-gray-300">Rewards (past 30D)</h4>
        <h4 className="mobile:text-xl text-2xl font-bold my-1 flex items-center">
          {formatLargeNumber(hntRewards)} HNT
        </h4>
        <span className="flex text-xs font-bold text-gray-300">
          {formatterUsd(hntRewards * (stats?.hnt_price.price || 0))}
        </span>
      </div>
    </div>
  );
};

export default WalletBalanceOverview;

//
// Utils
//

export const processBonesBalance = (amount: number | undefined) => {
  if (!amount) return 0;
  return amount / BONES_PER_HNT;
};
