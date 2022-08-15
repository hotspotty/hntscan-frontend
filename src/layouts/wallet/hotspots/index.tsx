import { ArrowSmUpIcon, WifiIcon } from "@heroicons/react/outline";
import CountryFlag from "components/countryFlag";
import HotspotLink from "components/hotspotLink";
import { ChevRight } from "components/icons/chevronRight";
import { useWallets } from "context/wallets";
import { isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import classNames from "utils/className";
import generateRewardScaleColor from "utils/generateRewardScaleColor";
import Spinner from "../../../../public/images/spinner.png";

const Hotspots: React.FC = () => {
  const { currentWalletHotspots, loading } = useWallets();

  if (loading.walletHotspots) {
    return (
      <div className="mt-20 w-20 h-20 mx-auto">
        <Image src={Spinner} alt="spinner" className="animate-spin-linear" />
      </div>
    );
  }

  if (isEmpty(currentWalletHotspots)) {
    return (
      <span className="mx-auto text-sm w-full flex justify-center mt-20">
        No Hotspots
      </span>
    );
  }

  return (
    <>
      {currentWalletHotspots.map((item, index) => (
        <Link
          key={index}
          href={`/blockchain/hotspots/${item.address}`}
          passHref
        >
          <div className="flex justify-between items-center border-b border-gray-200 last:border-b-0 pt-5 pb-4 group cursor-pointer">
            <div>
              <HotspotLink
                className="group-hover:underline"
                hotspotAddress={item.address}
                withStatus
              />

              <div className="flex mobile:flex-wrap items-center mt-1">
                <div className="flex items-center mr-6 mobile:mt-4">
                  <WifiIcon className="w-4" />
                  <span className="text-sm text-bold text-gray-300 ml-1 w-12">
                    {item.gain / 10}dBi
                  </span>
                </div>

                <div className="flex items-center mr-6 mobile:mt-4">
                  <ArrowSmUpIcon className="w-4" />
                  <span className="text-sm text-bold text-gray-300 ml-1 w-12">
                    {item.elevation}m
                  </span>
                </div>

                <div className="flex items-center mr-6 mobile:mt-4">
                  <span
                    className={classNames(
                      "w-3 h-3 rounded-full flex-shrink-0",
                      generateRewardScaleColor(item.reward_scale || 0)
                    )}
                  ></span>
                  <span className="text-sm text-bold text-gray-300 ml-1 w-12">
                    {item.reward_scale.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>

                <div className="flex items-center mr-6 mobile:mt-4">
                  <span className="text-sm text-bold text-gray-300">
                    <CountryFlag location={item.location} />
                  </span>
                </div>
              </div>
            </div>
            <ChevRight className="flex-shrink-0" />
          </div>
        </Link>
      ))}
    </>
  );
};

export default Hotspots;
