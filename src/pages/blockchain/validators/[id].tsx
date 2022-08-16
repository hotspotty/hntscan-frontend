import animalHash from "angry-purple-tiger";
import BlockLink from "components/blockLink";
import Box from "components/box";
import Breadcrumbs from "components/breadcrumbs";
import AreaChart from "components/charts/areaChart";
import WalletLink from "components/walletLink";
import { useStatistics } from "context/statistics";
import { useValidators } from "context/validators";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { keys, values } from "lodash";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import classNames from "utils/className";
import formatHotspotName from "utils/formatHotspotName";
import formatterUsd from "utils/formatterUsd";
import formatVersion from "utils/formatVersion";
import { BONES_PER_HNT } from "utils/types/global";
import useMount from "utils/useMount";

const ValidatorDetails: React.FC = () => {
  const { fetchValidatorByUuid, currentValidator, setCurrentValidator } =
    useValidators();
  const router = useRouter();
  const [days, setDays] = useState("30");
  const { stats } = useStatistics();

  useMount(() => {
    return () => {
      setCurrentValidator(null);
    };
  });

  const data = useMemo(
    () => [
      {
        title: "Staking Status",
        description: (
          <span className="capitalize">{currentValidator?.staked}</span>
        )
      },
      {
        title: "Last Heartbeat Block",
        description: (
          <BlockLink blockHeight={currentValidator?.last_heartbeat} />
        )
      },
      {
        title: "Version",
        description: formatVersion(currentValidator?.version_heartbeat)
      }
    ],
    [
      currentValidator?.last_heartbeat,
      currentValidator?.staked,
      currentValidator?.version_heartbeat
    ]
  );

  useEffect(() => {
    if (typeof router.query.id !== "string") return;

    fetchValidatorByUuid(router.query.id);
  }, [fetchValidatorByUuid, router.query.id]);

  const chartData = useMemo(() => {
    let data: { [key: string]: { y: number; name: string } } = {};

    if (!currentValidator) return [];

    const currentData =
      days === "1" ? currentValidator.rewards_24h : currentValidator.rewards;

    keys(currentData).map((key: string) => {
      data[key] = {
        y: currentData[key] / BONES_PER_HNT,
        name: moment
          .unix(Number(key))
          .format(days === "1" ? "DD MMM, HH:mm" : "DD MMM, YYYY")
      };
    });

    if (days === "1") {
      return values(data);
    }

    return values(data).slice(-days);
  }, [currentValidator, days]);

  const calculateRewardValue = useMemo(() => {
    let rewardValue = 0;

    chartData.forEach((item) => (rewardValue += item.y));

    return rewardValue;
  }, [chartData]);

  const calculatePenalty = useMemo(() => {
    const data = {
      performance: 0,
      tenure: 0
    };

    if (!currentValidator) return data;

    currentValidator.penalties.forEach((item) => {
      data[item.type] += item.amount;
    });

    return data;
  }, [currentValidator]);

  return (
    <div className="w-full mobile:w-11/12 mt-0 pb-36 mobile:pb-32">
      <Head>
        <title>
          HNTScan - Validator -{" "}
          {router.query.id ? animalHash(router.query.id as string) : ""}
        </title>
      </Head>

      <div className="w-full mt-24 mobile:hidden">
        <Breadcrumbs />
      </div>

      <div className="mobile:mt-8 mt-20">
        <h3 className="mobile:text-2xl text-4xl font-semibold flex items-center">
          <div
            className={classNames(
              "w-6 h-6 flex-shrink-0 rounded-full mr-3",
              currentValidator
                ? currentValidator?.online === "online"
                  ? "bg-green-300"
                  : "bg-red-300"
                : "animate-pulse bg-gray-300"
            )}
          />

          {currentValidator ? (
            formatHotspotName(currentValidator.name)
          ) : (
            <div className="w-72 rounded h-[40px] animate-pulse bg-gray-300 flex" />
          )}
        </h3>

        <div className="flex mobile:flex-wrap items-center mt-2 overflow-hidden">
          <WalletLink walletAddress={currentValidator?.owner} />
        </div>
      </div>
      <Box className="mt-10">
        <div className="w-full">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
            <p className="text-xl font-semibold">Overview</p>
          </div>
          <div className="flex mobile:flex-col">
            <div className="w-5/12 flex items-start flex-col mobile:w-full">
              <h4 className="text-sm">Rewards (past {days}D)</h4>

              {currentValidator ? (
                <h4 className="text-2xl font-bold my-1 flex items-center">
                  {calculateRewardValue.toFixed(3)} HNT
                </h4>
              ) : (
                <div className="my-2 w-32 rounded h-6 animate-pulse bg-gray-300 flex" />
              )}

              <span className="flex text-xs font-bold text-gray-300">
                {formatterUsd(
                  calculateRewardValue * (stats?.hnt_price.price || 0)
                )}
              </span>
              <AreaChart
                isDateActive={true}
                disableMarker={true}
                series={[
                  {
                    data: chartData.length ? chartData : [0, 0, 0, 0, 0, 0, 0],
                    name: "HNT Earning"
                  }
                ]}
                days={days}
                onChangeDays={setDays}
              />
            </div>

            <div className="flex flex-wrap justify-between w-7/12 mobile:w-full mobile:flex-col mobile:items-center">
              {data.map((item, index) => (
                <div
                  key={index}
                  className={classNames(
                    index < 2 ? "mb-4 mobile:mb-0" : "",
                    "mobile:w-full w-4/12 mobile:flex mobile:justify-between mobile:mt-8"
                  )}
                >
                  <span className="text-sm flex items-center">
                    {item.title}
                  </span>

                  <div className="w-fit">
                    {currentValidator ? (
                      <p className="text-2xl font-bold my-1 mobile:text-lg mobile:w-fit mobile:max-w-[233px]">
                        {item.description}
                      </p>
                    ) : (
                      <div className="my-2 w-32 rounded h-6 animate-pulse bg-gray-300 flex" />
                    )}
                  </div>
                </div>
              ))}

              <div className="flex flex-col w-full mobile:mt-8">
                <p className="text-sm flex items-center">Penalty Score</p>
                {currentValidator ? (
                  <p className="text-2xl font-bold my-1 mobile:text-lg -mb-5">
                    {currentValidator?.penalty_score.toFixed(3)}
                  </p>
                ) : (
                  <div className="my-2 w-32 rounded h-6 animate-pulse bg-gray-300 flex" />
                )}

                <div className="-ml-2">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                      ...options,
                      series: [
                        {
                          type: "bar",
                          name: "Tenure",
                          data: [Number(calculatePenalty.tenure.toFixed(3))]
                        },
                        {
                          type: "bar",
                          name: "Perfomance",
                          data: [
                            Number(calculatePenalty.performance.toFixed(3))
                          ]
                        }
                      ]
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ValidatorDetails;

//
// Utils
//

const options: Highcharts.Options = {
  chart: {
    type: "bar",
    height: 100,
    backgroundColor: "transparent"
  },
  colors: ["rgb(41, 211, 145)", "rgb(71, 77, 255)"],
  title: {
    text: ""
  },
  xAxis: {
    plotBands: [],
    labels: {
      enabled: false
    },
    gridLineColor: "transparent",
    lineColor: "transparent",
    minorTickLength: 0,
    tickLength: 0
  },
  legend: {
    enabled: false
  },
  tooltip: {
    headerFormat: ""
  },
  yAxis: {
    min: 0,
    labels: {
      enabled: false
    },
    gridLineColor: "transparent",
    lineColor: "transparent",
    title: {
      text: ""
    }
  },
  credits: {
    enabled: false
  },
  plotOptions: {
    bar: {
      borderRadius: 2
    },
    series: {
      stacking: "normal",
      borderColor: "transparent"
    }
  }
};
