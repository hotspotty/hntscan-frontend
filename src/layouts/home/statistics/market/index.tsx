import AreaChart from "components/charts/areaChart";
import Tooltip from "components/tooltip";
import { useStatistics } from "context/statistics";
import { keys, values } from "lodash";
import moment from "moment";
import React, { useMemo } from "react";
import classNames from "utils/className";
import formatLargeNumber from "utils/formatLargeNumber";
import formatterUsd from "utils/formatterUsd";

const Market: React.FC = () => {
  const { stats, oracleDataPrice } = useStatistics();

  const data = useMemo(() => {
    return [
      {
        title: "Market Price",
        description: formatterUsd(stats?.hnt_price?.price),
        tooltipMessage: "Based on data provided by CoinGecko",
        highlight: {
          value: `${stats?.hnt_price?.percentage?.toFixed(2)}%`,
          color:
            (stats?.hnt_price?.percentage || 0) < 0
              ? "text-red-400"
              : "text-green-300"
        }
      },
      {
        title: "Circulating Supply",
        description: formatLargeNumber(stats?.circulating_supply),
        tooltipMessage: `${formatLargeNumber(
          stats?.circulating_supply
        )} HNT currently in circulation`,
        highlight: {
          value: "HNT",
          color: "text-gray-300"
        }
      },
      {
        title: "Data Credit Price",
        description: "$0.00001",
        tooltipMessage:
          "Data Credits are fixed at $0.00001 USD. Oracle price is used to compute how much HNT to burn.",
        highlight: {
          value: "Fixed",
          color: "text-gray-300"
        }
      },
      {
        title: "Market Cap Rank",
        description: stats?.market_cap_rank,
        tooltipMessage: "Rank position in Market Cap"
      },
      {
        title: "Market Cap",
        description: formatterUsd(stats?.market_cap, true),
        tooltipMessage: "Based on data provided by CoinGecko",
        highlight: {
          value: `Vol: ${formatterUsd(stats?.market_cap, true)}`,
          color: "text-gray-300"
        }
      },
      {
        title: "Max Supply",
        description: "223M",
        tooltipMessage:
          "There is an effective cap of 223M HNT due to reward halvings every 2 years",
        highlight: {
          value: "HNT",
          color: "text-gray-300"
        }
      },
      {
        title: "DC per HNT",
        description: (
          (stats?.hnt_price?.price || 0) / 0.00001
        ).toLocaleString(),
        tooltipMessage:
          "DC are used to transmit or receive 24 bytes of data over the Helium Network"
      }
    ];
  }, [
    stats?.circulating_supply,
    stats?.hnt_price?.percentage,
    stats?.hnt_price?.price,
    stats?.market_cap,
    stats?.market_cap_rank
  ]);

  const chartData = useMemo(() => {
    let data: { [key: string]: { y: number; name: string } } = {};

    keys(oracleDataPrice?.prices).forEach((key) => {
      let date = moment.unix(Number(key)).format("DD MMM, YYYY");
      let value = oracleDataPrice?.prices[key] || 0;

      if (data[date]) {
        data[date].y += value;
      }

      data = {
        ...data,
        [date]: {
          y: value,
          name: date
        }
      };
    });

    return values(data);
  }, [oracleDataPrice?.prices]);

  return (
    <div className="w-full flex justify-between mobile:flex-col">
      <div className="lg:w-5/12 h-fit">
        <div className="mb-12">
          <Tooltip
            title="Oracle Price Chart"
            tooltipMessage="Price based in Oracle price"
            className="text-sm text-gray-300"
          />
        </div>
        <AreaChart
          isDateActive={false}
          series={[
            {
              data: chartData,
              name: "Oracle Price"
            }
          ]}
          labelTime="30 day trend"
          minValue={oracleDataPrice?.min}
          maxValue={oracleDataPrice?.max}
        />
      </div>
      <div className="lg:w-7/12 mobile:flex-col flex flex-wrap">
        {data.map((item, index) => (
          <div
            key={index}
            className="mobile:flex mobile:items-center justify-between mobile:mt-8 lg:w-1/4 lg:first:mb-20 lg:mb-8"
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
              <span className="text-2xl font-bold my-1">{item.description}</span>
              {item.highlight && (
                <span
                  className={classNames(
                    `flex text-xs font-bold mobile:justify-end ${item.highlight.color}`
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

export default Market;
