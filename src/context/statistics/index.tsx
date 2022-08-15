import { AxiosResponse } from "axios";
import React, { useCallback, useContext, useMemo, useState } from "react";
import api from "utils/apiService";
import { STAKE_VALUE } from "utils/types/global";
import { OraclePrice } from "utils/types/statistics";
import useMount from "utils/useMount";
import { OverviewStats } from "../../utils/types/overview";

interface Props {
  children: JSX.Element;
}

export type ContextValue = {
  stats: OverviewStats | undefined;
  totalHntStaked: number;
  diffHotspotsAdded: number;
  oracleDataPrice: OraclePrice | undefined;
  fetchOracleDataPrice: () => Promise<void>;
};

export const StatisticsContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const StatisticsProvider: React.FC<Props> = (props) => {
  const [stats, setStats] = useState<OverviewStats>();
  const [oracleDataPrice, setDataOracle] = useState<OraclePrice>();

  const fetchOverviewStats = useCallback(async () => {
    try {
      const response: AxiosResponse<OverviewStats> = await api.get(
        "v1/stats/overview"
      );

      setStats(response.data);
    } catch {}
  }, []);

  const fetchOracleDataPrice = useCallback(async () => {
    try {
      const response: AxiosResponse<OraclePrice> = await api.get(
        "v1/price/oracle/"
      );
      setDataOracle(response.data);
    } catch {}
  }, []);

  const totalHntStaked = useMemo(() => {
    if (!stats) return 0;

    return stats.validator.count * STAKE_VALUE;
  }, [stats]);

  const diffHotspotsAdded = useMemo(() => {
    if (!stats) return 0;

    return stats?.hotspots.trend.end - stats?.hotspots.trend.start;
  }, [stats]);

  useMount(() => {
    fetchOverviewStats();
    fetchOracleDataPrice();
  });

  const value = useMemo(
    () => ({
      stats,
      totalHntStaked,
      diffHotspotsAdded,
      oracleDataPrice,
      fetchOracleDataPrice
    }),
    [
      stats,
      totalHntStaked,
      diffHotspotsAdded,
      oracleDataPrice,
      fetchOracleDataPrice
    ]
  );

  return <StatisticsContext.Provider value={value} {...props} />;
};

export const useStatistics = (): ContextValue => {
  const context = useContext(StatisticsContext);

  if (context === undefined) {
    throw new Error("useStatistics must be used within an StatisticsProvider");
  }

  return context;
};
