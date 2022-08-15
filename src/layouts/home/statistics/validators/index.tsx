import { useStatistics } from "context/statistics";
import React, { useMemo } from "react";
import classNames from "utils/className";
import formatLargeNumber from "utils/formatLargeNumber";
import formatterUsd from "utils/formatterUsd";
import formatVersion from "utils/formatVersion";

const Validators: React.FC = () => {
  const { stats, totalHntStaked } = useStatistics();

  const supplyStakedPercent = useMemo(() => {
    if (!stats) return "";

    return totalHntStaked / stats.circulating_supply;
  }, [stats, totalHntStaked]);

  const onlinePercent = useMemo(() => {
    if (!stats) return "";

    const percent = (stats?.validator.online * 100) / stats.validator.count;

    return percent.toFixed(2);
  }, [stats]);

  const totalMarketCapStaked = useMemo(() => {
    if (!stats) return "";

    return formatterUsd(totalHntStaked * stats?.hnt_price?.price);
  }, [stats, totalHntStaked]);

  const latestVersion = useMemo(() => {
    if (stats?.validator === undefined) {
      return 0;
    }

    const version = Object.keys(stats?.validator.versions || "")[
      Object.keys(stats?.validator.versions || "").length - 1
    ];

    return formatVersion(Number(version));
  }, [stats?.validator]);

  const AprPercent = useMemo(
    () => (stats?.validator.apr !== undefined ? stats?.validator.apr * 100 : 0),
    [stats?.validator.apr]
  );

  const cards = useMemo(() => {
    return [
      {
        title: "Staked Validators",
        value: stats?.validator?.count.toLocaleString() || 0
      },
      {
        title: "Consensus Size",
        value: stats?.validator?.consensus_number
      },
      {
        title: "% Online",
        value: onlinePercent + "%" || 0
      },
      {
        title: "Total Staked (HNT)",
        value: formatLargeNumber(totalHntStaked),
        highlight: {
          value: totalMarketCapStaked,
          color: "text-gray-300"
        }
      },
      {
        title: "% Supply Staked",
        value: supplyStakedPercent.toLocaleString(undefined, {
          style: "percent",
          maximumFractionDigits: 2
        })
      },
      {
        title: "Estimated APR",
        value: AprPercent.toFixed(2) + "%"
      },
      {
        title: "Validator Versions",
        value: "Latest Version: " + latestVersion
      }
    ];
  }, [
    stats?.validator?.count,
    stats?.validator?.consensus_number,
    onlinePercent,
    totalHntStaked,
    totalMarketCapStaked,
    supplyStakedPercent,
    AprPercent,
    latestVersion
  ]);

  return (
    <div className="w-full flex flex-wrap justify-between mobile:flex-col">
      {cards.map((item, index) => (
        <div
          key={index}
          className="flex flex-col h-full lg:w-[32%] lg:min-h-[80px] rounded-xl mb-6"
        >
          <span className="text-sm text-gray-300 flex items-center">
            {item.title}
          </span>

          {item.value && (
            <span className="text-2xl font-bold my-1">{item.value}</span>
          )}

          {item.highlight && (
            <span
              className={classNames(
                `flex text-xs font-bold ${item.highlight.color}`
              )}
            >
              {item.highlight.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Validators;
