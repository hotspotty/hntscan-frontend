import animalHash from "angry-purple-tiger";
import { useHotspots } from "context/hotspots";
import Link from "next/link";
import React from "react";
import classNames from "utils/className";

interface Props {
  className?: string;
  hotspotAddress: string | undefined;
  withStatus?: boolean;
}

const HotspotLink: React.FC<Props> = ({
  className,
  hotspotAddress,
  withStatus
}) => {
  const { hotspotsStatus } = useHotspots();

  if (!hotspotAddress) {
    return (
      <div className="py-1">
        <div className="w-48 rounded h-4 animate-pulse bg-gray-300 flex" />
      </div>
    );
  }

  return (
    <Link href={`/blockchain/hotspots/${hotspotAddress}`} passHref>
      <div
        className={classNames("flex items-center hover:underline", className)}
      >
        {withStatus &&
          (!!hotspotsStatus[hotspotAddress] ? (
            <span
              className={classNames(
                "w-3 h-3 flex-shrink-0 rounded-full mr-1.5",
                hotspotsStatus[hotspotAddress] ? "bg-green-300" : "bg-red-300"
              )}
            />
          ) : (
            <span className="w-3 h-3 flex-shrink-0 rounded-full mr-1.5 animate-pulse bg-gray-300" />
          ))}
        <span className="text-purple-300 font-medium cursor-pointer">
          {animalHash(hotspotAddress)}
        </span>
      </div>
    </Link>
  );
};

export default HotspotLink;
