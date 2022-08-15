import { XCircleIcon } from "@heroicons/react/solid";
import BlockLink from "components/blockLink";
import { ChevRight } from "components/icons/chevronRight";
import ValidatorLink from "components/validatorLink";
import { useWallets } from "context/wallets";
import { isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import formaterVersion from "utils/formatVersion";
import Spinner from "../../../../public/images/spinner.png";

const Validators: React.FC = () => {
  const { currentWalletValidators, loading } = useWallets();

  if (loading.walletValidators) {
    return (
      <div className="mt-20 w-20 h-20 mx-auto">
        <Image src={Spinner} alt="spinner" className="animate-spin-linear" />
      </div>
    );
  }

  if (isEmpty(currentWalletValidators)) {
    return (
      <span className="mx-auto text-sm w-full flex justify-center mt-20">
        No Validators
      </span>
    );
  }

  return (
    <>
      {currentWalletValidators.map((item, index) => (
        <Link
          key={index}
          href={`/blockchain/validators/${item.address}`}
          passHref
        >
          <div className="flex justify-between items-center border-b border-gray-200 last:border-b-0 pt-5 pb-4 group cursor-pointer">
            <div>
              <ValidatorLink
                className="group-hover:underline"
                validatorAddress={item.address}
                online={item.online}
              />

              <div className="flex mobile:flex-wrap items-center mt-1">
                <div className="flex items-center mr-6 mobile:mt-4">
                  <span className="text-sm text-bold text-gray-300 ml-1 capitalize">
                    {item.staked}
                  </span>
                </div>

                <div className="flex items-center mr-6 mobile:mt-4">
                  <XCircleIcon className="text-red-300 w-4" />
                  <span className="text-sm text-bold text-gray-300 capitalize">
                    {item.penalty_score.toFixed(3)}
                  </span>
                </div>

                <div className="flex items-center mr-6 mobile:mt-4">
                  <span className="text-sm text-bold text-gray-300 ml-1">
                    v{formaterVersion(item.version_heartbeat)}
                  </span>
                </div>

                <div className="flex items-center mr-6 mobile:mt-4">
                  <BlockLink
                    className="text-sm"
                    blockHeight={item.last_heartbeat}
                  />
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

export default Validators;
