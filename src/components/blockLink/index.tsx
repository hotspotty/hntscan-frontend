import Link from "next/link";
import React from "react";
import classNames from "utils/className";

interface Props {
  className?: string;
  blockHeight: number | undefined;
}

const BlockLink: React.FC<Props> = ({ className, blockHeight }) =>
  blockHeight ? (
    <Link href={`/blockchain/blocks/${blockHeight}`} passHref>
      <span
        className={classNames(
          "text-purple-300 font-sm cursor-pointer hover:underline",
          className
        )}
      >
        #{blockHeight}
      </span>
    </Link>
  ) : (
    <div className={classNames("py-1", className)}>
      <div className="w-20 rounded h-4 animate-pulse bg-gray-300 flex" />
    </div>
  );

export default BlockLink;
