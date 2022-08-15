import AreaChart from "components/charts/areaChart";
import CountryFlag from "components/countryFlag";
import { useHotspots } from "context/hotspots";
import { useStatistics } from "context/statistics";
import { keys, values } from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import classNames from "utils/className";
import formatterUsd from "utils/formatterUsd";
import generateRewardScaleColor from "utils/generateRewardScaleColor";
import { BONES_PER_HNT } from "utils/types/global";

const HotspotsOverview: React.FC = () => {
  const {
    currentHotspot,
    fetchHotspotRewards,
    currentHotspotRewards,
    avgBeacons,
    loading
  } = useHotspots();
  const { stats } = useStatistics();
  const [days, setDays] = useState("30");

  useEffect(() => {
    if (!currentHotspot?.address) return;

    fetchHotspotRewards(currentHotspot?.address, days);
  }, [currentHotspot?.address, days, fetchHotspotRewards]);

  const data = useMemo(
    () => [
      {
        title: "Transmit scale",
        description: currentHotspot?.reward_scale.toFixed(2) || 0,
        status: true,
        width: ""
      },
      {
        title: "7D Avg Beacons",
        description: loading.avgBeacons ? (
          <div className="w-12 rounded h-[30px] animate-pulse bg-gray-300 flex" />
        ) : (
          avgBeacons
        )
      },
      {
        title: "Total Witnessed",
        description: currentHotspot?.witness_count || 0
      },
      {
        title: "Location",
        description: currentHotspot?.location && (
          <CountryFlag location={currentHotspot.location} />
        )
      }
    ],
    [
      avgBeacons,
      currentHotspot?.location,
      currentHotspot?.reward_scale,
      currentHotspot?.witness_count,
      loading.avgBeacons
    ]
  );

  const chartData = useMemo(() => {
    let data: { [key: string]: { y: number; name: string } } = {};

    const currentData =
      days === "1"
        ? currentHotspotRewards.rewards_24h
        : currentHotspotRewards.rewards;

    keys(currentData).map((key: string) => {
      data[key] = {
        y: currentData[key] / BONES_PER_HNT,
        name: moment
          .unix(Number(key))
          .format(days === "1" ? "DD MMM, HH:mm" : "DD MMM, YYYY")
      };
    });

    return values(data);
  }, [currentHotspotRewards, days]);

  const calculateRewardValue = useMemo(() => {
    let rewardValue = 0;

    chartData.forEach((item) => (rewardValue += item.y));

    return rewardValue;
  }, [chartData]);

  return (
    <div className="flex">
      <div className="w-full flex justify-between mobile:flex-col">
        <div className="w-5/12 flex items-start flex-col mobile:w-full">
          <h4 className="text-sm">Rewards (past {days}D)</h4>
          <h4 className="text-2xl font-bold my-1 flex items-center">
            {calculateRewardValue.toFixed(3)} HNT
          </h4>
          <span className="flex text-xs font-bold text-gray-300">
            {formatterUsd(calculateRewardValue * (stats?.hnt_price.price || 0))}
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
                index < 2 ? "mb-12 mobile:mb-0" : "",
                "mobile:w-full w-4/12 last:w-full mobile:flex mobile:justify-between mobile:mt-8"
              )}
            >
              <span className="text-sm flex items-center">{item.title}</span>

              <div className="w-fit">
                <div className="flex mobile:justify-end items-center">
                  {item.status !== undefined && (
                    <div
                      className={classNames(
                        "w-6 h-6 rounded-full mr-2",
                        generateRewardScaleColor(
                          currentHotspot?.reward_scale || 0
                        )
                      )}
                    ></div>
                  )}
                  <span className="text-2xl font-bold my-1 mobile:text-lg mobile:w-fit mobile:max-w-[233px]">
                    {item.description}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotspotsOverview;
