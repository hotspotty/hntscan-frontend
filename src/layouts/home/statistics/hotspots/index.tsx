import AreaChart from "components/charts/areaChart";
import { keys } from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import classNames from "utils/className";
import formatHotspotName from "utils/formatHotspotName";
import { useStatistics } from "../../../../context/statistics/index";

const Hotspots: React.FC = () => {
  const { stats, diffHotspotsAdded } = useStatistics();
  const router = useRouter();

  const hotspotsOnlinePercent = useMemo(() => {
    if (!stats) return 0;

    return stats.hotspots.online / stats.hotspots.total;
  }, [stats]);

  const data = useMemo(() => {
    return [
      {
        title: "% Online",
        description: stats?.hotspots?.online?.toLocaleString(),
        highlight: {
          value: hotspotsOnlinePercent.toLocaleString(undefined, {
            style: "percent",
            maximumFractionDigits: 2
          }),
          color: "text-gray-300"
        }
      },
      {
        title: "Cities",
        description: stats?.cities.toLocaleString()
      },
      {
        title: "Latest Hotspot",
        description: formatHotspotName(stats?.last_hotspot?.name || ""),
        onClick: () =>
          router.push(`/blockchain/hotspots/${stats?.last_hotspot?.hash}`),
        highlight: {
          value: stats?.last_hotspot?.country,
          color: "text-gray-300"
        }
      },
      {
        title: "Makers",
        description: stats?.last_maker?.count,
        highlight: {
          value: `Latest: ${stats?.last_maker?.name}`,
          color: "text-gray-300"
        }
      },
      {
        title: "Countries",
        description: stats?.countries
      }
    ];
  }, [
    hotspotsOnlinePercent,
    router,
    stats?.cities,
    stats?.countries,
    stats?.hotspots?.online,
    stats?.last_hotspot?.country,
    stats?.last_hotspot?.hash,
    stats?.last_hotspot?.name,
    stats?.last_maker?.count,
    stats?.last_maker?.name
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
      <div className="w-5/12 mobile:w-full mobile:border-b border-gray-400 mobile:pb-6">
        <p className="text-sm text-gray-300">Hotspots</p>
        <p className="font-bold text-2xl my-1 flex items-center">
          {stats?.hotspots?.total.toLocaleString()}
        </p>
        <span
          className={classNames(
            "flex text-xs font-bold mobile:justify-end text-green-300"
          )}
        >
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
              index < 2 && "lg:mb-16",
              "mobile:flex mobile:items-center justify-between mobile:mt-8 lg:w-1/3"
            )}
          >
            <span className="text-sm text-gray-300">{item.title}</span>
            <div className="mobile:text-right">
              <p
                onClick={item.onClick}
                className={classNames(
                  "text-2xl font-bold my-1",
                  item.onClick && "cursor-pointer hover:text-purple-400"
                )}
              >
                {item.description}
              </p>
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

export default Hotspots;
