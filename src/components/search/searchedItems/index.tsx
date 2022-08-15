import CountryFlag from "components/countryFlag";
import { SearchResponse, useExplorer } from "context/explorer/index";
import { processBonesBalance } from "layouts/wallet/overview";
import { isEmpty } from "lodash";
import Image from "next/image";
import React from "react";
import classNames from "utils/className";
import formatHotspotName from "utils/formatHotspotName";
import formatLargeNumber from "utils/formatLargeNumber";
import { formatTransactionType } from "utils/formatTransactionType";
import formatVersion from "utils/formatVersion";
import truncateText from "utils/truncateText";
import Spinner from "../../../../public/images/spinner.png";

interface Props {
  className?: string;
}

const SearchedItems: React.FC<Props> = ({ className }) => {
  const { searchedItems, handleHistoryItem, loadingSearch } = useExplorer();

  if (!searchedItems && !loadingSearch) return null;

  return (
    <div
      className={classNames(
        className,
        "bg-white shadow-3xl absolute rounded-md overflow-hidden"
      )}
    >
      <div className="overflow-y-auto  max-h-[403px] history-search">
        {loadingSearch ? (
          <div className="pt-5 pb-10 w-10 h-10 mx-auto min-h-[72px]">
            <Image
              src={Spinner}
              alt="spinner"
              className="animate-spin-linear"
            />
          </div>
        ) : isEmpty(searchedItems) ? (
          <div className="flex items-center justify-center min-h-[72px]">
            <span className="text-purple-600 text-sm font-medium">
              No results
            </span>
          </div>
        ) : (
          searchedItems?.map((item, index) => {
            const label = getLabel(item);
            if (!label) return;
            return (
              <span
                key={index}
                className="flex items-center cursor-pointer hover:bg-gray-100 px-5 py-4"
                onClick={() => {
                  handleHistoryItem(item);
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-gray-800 text-sm font-medium">
                    {label.title}
                  </span>

                  {label.description && (
                    <span className="text-gray-500 text-sm font-medium">
                      {label.description}
                    </span>
                  )}
                </div>
                <span
                  className={classNames(
                    "text-white capitalize px-2 py-1 text-xs font-medium rounded-md mb-1 ml-auto",
                    label.color
                  )}
                >
                  {label.tag}
                </span>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SearchedItems;

//
// Utils
//

export const getLabel = (item: SearchResponse) => {
  if (item.data_type === "hotspot") {
    return {
      tag: item.data_type,
      title: formatHotspotName(item.name),
      description: (
        <CountryFlag location={item.location} cubeColor="#6b7280a2" />
      ),
      color: "bg-blue-500"
    };
  }

  if (item.data_type === "validator") {
    return {
      tag: item.data_type,
      title: (
        <div className="flex items-center">
          <span
            className={classNames(
              "w-3 h-3 flex-shrink-0 rounded-full mr-1.5",
              item.online === "online" ? "bg-green-300" : "bg-red-300"
            )}
          />
          <span className="font-medium">{formatHotspotName(item.name)}</span>
        </div>
      ),
      description: (
        <div className="flex items-center gap-2">
          <span className="capitalize">{item.staked}</span>
          <span>v{formatVersion(item.version_heartbeat)}</span>
          <span>#{item.last_heartbeat}</span>
        </div>
      ),
      color: "bg-green-500"
    };
  }

  if (item.data_type === "wallet") {
    return {
      tag: item.data_type,
      title: <pre>{truncateText(item.address, 20)}</pre>,
      description: (
        <div className="flex items-center gap-1 text-xs">
          {item.hotspot_count > 0 && (
            <span>{`${item.hotspot_count} hotspot${
              item.hotspot_count === 1 ? "" : "s"
            }`}</span>
          )}
          {item.validator_count > 0 && (
            <span>{`${item.validator_count} validator${
              item.validator_count === 1 ? "" : "s"
            }`}</span>
          )}
          {item.balance.hnt > 0 && (
            <span>{`${formatLargeNumber(
              processBonesBalance(item.balance.hnt)
            )} HNT`}</span>
          )}
          {item.balance.mobile > 0 && (
            <span>{`${formatLargeNumber(
              processBonesBalance(item.balance.mobile)
            )} MOBILE`}</span>
          )}
          {item.balance.dc > 0 && (
            <span>{`${formatLargeNumber(item.balance.dc)} DC`}</span>
          )}
          {item.balance.hst > 0 && (
            <span>{`${formatLargeNumber(
              processBonesBalance(item.balance.hst)
            )} HST`}</span>
          )}
        </div>
      ),
      color: "bg-purple-500"
    };
  }

  if (item.data_type === "block") {
    return {
      tag: item.data_type,
      title: `#${item.height.toString()}`,
      description: <pre>{truncateText(item.hash, 20)}</pre>,
      color: "bg-yellow-500"
    };
  }

  if (item.data_type === "transaction") {
    return {
      tag: item.data_type,
      title: formatTransactionType(item.type),
      description: <pre>{truncateText(item.hash, 20)}</pre>,
      color: "bg-orange-500"
    };
  }

  return;
};
