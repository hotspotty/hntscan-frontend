import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useMemo } from "react";
import classNames from "utils/className";

interface Props {
  isDateActive: boolean;
  disableMarker?: boolean;
  series: any[];
  labelTime?: string;
  minValue?: number;
  maxValue?: number;
  days?: string;
  onChangeDays?: (days: string) => void;
}

const AreaChart: React.FC<Props> = ({
  isDateActive,
  labelTime,
  series,
  disableMarker,
  minValue,
  maxValue,
  days,
  onChangeDays
}) => {
  const formats = useMemo(
    () => [
      { title: "24H", value: "1" },
      { title: "7D", value: "7" },
      { title: "14D", value: "14" },
      { title: "30D", value: "30" }
    ],
    []
  );

  const options: Highcharts.Options = useMemo(() => {
    return {
      chart: {
        height: 180,
        type: "areaspline",
        backgroundColor: "transparent"
      },
      title: {
        text: ""
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
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
      yAxis: {
        title: {
          text: ""
        },
        max: maxValue,
        min: minValue,
        format: "${text}",
        labels: {
          style: { color: "#FFF", fontWeight: "600", fontSize: "14px" },
          enabled: disableMarker ? false : true
        },
        gridLineColor: "transparent"
      },
      tooltip: {
        shared: false,
        valueSuffix: "",
        enabled: true
      },
      plotOptions: {
        areaspline: {
          lineWidth: 2,
          lineColor: "rgba(20, 122, 214, 1)",
          marker: {
            enabled: false
          },
          fillOpacity: 0.5,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, "rgba(20, 122, 214, 1)"],
              [1, "rgba(149, 70, 234, 0.09)"]
            ]
          }
        }
      },
      series: series
    };
  }, [disableMarker, maxValue, minValue, series]);

  return (
    <div className="relative w-full flex flex-col -ml-[10px]">
      <HighchartsReact highcharts={Highcharts} options={options} />

      {labelTime && (
        <span className="text-xs uppercase ml-auto pr-3">{labelTime}</span>
      )}

      {isDateActive && (
        <div className="flex justify-end">
          {formats.map((item, index) => (
            <button
              key={index}
              onClick={() => onChangeDays && onChangeDays(item.value)}
              className={classNames(
                "border border-white text-xs px-4 py-1 rounded-full font-medium mr-3 hover:bg-gray-300 hover:bg-opacity-30",
                item.value === days && "bg-gray-300 bg-opacity-30"
              )}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AreaChart;
