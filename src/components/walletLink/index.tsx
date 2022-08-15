import { Duplicate } from "components/icons/duplicate";
import QrCodeIcon from "components/icons/qrCodeIcon";
import Link from "next/link";
import React from "react";
import classNames from "utils/className";
import copyToClipboard from "utils/copyToClipboard";
import truncateText from "utils/truncateText";

interface Props {
  className?: string;
  walletAddress: string | undefined;
}

const WalletLink: React.FC<Props> = ({ className, walletAddress }) =>
  walletAddress ? (
    <div className={classNames("flex items-center text-sm", className)}>
      <QrCodeIcon />

      <Link href={`/blockchain/wallets/${walletAddress}`} passHref>
        <span
          className="text-purple-300 mx-1 cursor-pointer hover:underline"
          title={walletAddress}
        >
          <pre>{truncateText(walletAddress, 20)}</pre>
        </span>
      </Link>
      <button onClick={() => copyToClipboard(walletAddress)}>
        <Duplicate width={18} />
      </button>
    </div>
  ) : (
    <div className={classNames("py-1", className)}>
      <div className="w-48 rounded h-4 animate-pulse bg-gray-300 flex" />
    </div>
  );

export default WalletLink;
