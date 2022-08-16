import BlockLink from "components/blockLink";
import AreaChart from "components/charts/areaChart";
import Tooltip from "components/tooltip";
import { useStatistics } from "context/statistics";
import { keys } from "lodash";
import moment from "moment";
import React, { useMemo } from "react";
import classNames from "utils/className";
import formatLargeNumber from "utils/formatLargeNumber";
import formatterUsd from "utils/formatterUsd";

const Overview: React.FC = () => {
  const { stats, totalHntStaked, diffHotspotsAdded } = useStatistics();

  const data = useMemo(() => {
    return [
      {
        title: "HNT Price",
        description: formatterUsd(stats?.hnt_price?.price),
        tooltipMessage: "Based on data provided by CoinGecko",
        highlight: {
          value: `${stats?.hnt_price?.percentage.toFixed(2)}%`,
          color:
            (stats?.hnt_price?.percentage || 0) > 0
              ? "text-green-400"
              : "text-red-400"
        }
      },
      {
        title: "DC Spent (30D)",
        description: `${(Math.abs(Number(stats?.dc_spent)) / 1.0e9).toFixed(
          2
        )} bn`,
        tooltipMessage:
          "Data Credits are spent for transaction fees and to send data over the Helium Network. HNT are burned to create DC.",
        highlight: {
          value: formatterUsd((stats?.dc_spent || 0) * 0.00001),
          color: "text-gray-300"
        }
      },
      {
        title: "Total Beacons",
        description: stats?.challenges?.toLocaleString()
      },
      {
        title: "Last Block",
        description: <BlockLink blockHeight={stats?.block.height} />
      },
      {
        title: "HNT Staked",
        description: formatLargeNumber(totalHntStaked),
        tooltipMessage: "The amount of HNT being staked by Validators",
        highlight: {
          value: formatterUsd(totalHntStaked * (stats?.hnt_price?.price || 0)),
          color: "text-gray-300"
        }
      },
      {
        title: "Staked Validators",
        description: stats?.validator?.count?.toLocaleString(),
        tooltipMessage: ""
      }
    ];
  }, [
    stats?.block?.height,
    stats?.challenges,
    stats?.dc_spent,
    stats?.hnt_price?.percentage,
    stats?.hnt_price?.price,
    stats?.validator?.count,
    totalHntStaked
  ]);

  const chartData = useMemo(
    () =>
      keys(stats?.hotspots?.trend?.last_days).map((key) => ({
        y: stats?.hotspots?.trend?.last_days[key],
        name: moment(key).format("DD MMM, YYYY")
      })),
    [stats?.hotspots?.trend?.last_days]
  );

  return (
    <div className="w-full flex mobile:flex-col">
      <div className=" mobile:w-full w-5/12 mobile:border-b border-gray-400 mobile:pb-6">
        <p className="text-sm text-gray-300">Hotspots</p>
        <p className="text-2xl font-bold my-1">
          {stats?.hotspots?.total?.toLocaleString()}
        </p>
        <span className="flex text-xs font-bold mobile:justify-end text-green-300">
          +{diffHotspotsAdded.toLocaleString()}
        </span>

        <div className="mt-10">
          <AreaChart
            isDateActive={false}
            series={[{ data: chartData, name: "Hotspots" }]}
            labelTime="30 day trend"
            minValue={stats?.hotspots?.trend?.start}
            maxValue={stats?.hotspots?.trend?.end}
          />
        </div>
      </div>

      <div className="lg:w-7/12 mobile:flex-col flex flex-wrap">
        {data.map((item, index) => (
          <div
            key={index}
            className={classNames(
              index < 2 ? "lg:mb-12" : "",
              "mobile:flex mobile:items-center justify-between mobile:mt-8 lg:w-1/3"
            )}
          >
            {item.tooltipMessage ? (
              <Tooltip
                title={item.title}
                tooltipMessage={item.tooltipMessage}
                className="text-sm text-gray-300"
              />
            ) : (
              <span className="text-sm text-gray-300">{item.title}</span>
            )}
            <div className="mobile:text-right">
              <span className="text-2xl font-bold my-1">
                {item.description}
              </span>
              {item.highlight && (
                <span
                  className={classNames(
                    "flex text-xs font-bold mobile:justify-end",
                    item.highlight.color
                  )}
                >
                  {item.highlight.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
