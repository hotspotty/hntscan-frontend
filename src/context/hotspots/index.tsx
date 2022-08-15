import { useAppearence } from "context/appearence";
import { isEmpty, keyBy } from "lodash";
import React, { useCallback, useContext, useMemo, useState } from "react";
import api from "utils/apiService";
import { Hotspot, HotspotStatus } from "utils/types/hotspots";
import { HotspotActivity } from "../../utils/types/hotspots";

interface Props {
  children: JSX.Element;
}

export type ContextValue = {
  hotspots: Hotspot[];
  fetchHotspots: (page: number) => Promise<void>;
  fetchHotspotByUuid: (hotspotUuid: string) => Promise<void>;
  fecthHotspotActivity: (
    hotspotUuid: string | undefined,
    page: number
  ) => Promise<void>;
  currentHotspotActivities: HotspotActivity;
  setCurrentHotspotActivities: (
    value: React.SetStateAction<HotspotActivity>
  ) => void;
  loading: Loading;
  currentHotspot: Hotspot | null;
  setCurrentHotspot: React.Dispatch<React.SetStateAction<Hotspot | null>>;
  fetchHotspotRewards: (hotspotUuid: string, days: string) => Promise<void>;
  currentHotspotRewards: {
    days: number;
    rewards: { [key: string]: number };
    rewards_24h: { [key: string]: number };
  };
  avgBeacons: number;
  fetchHotspotAvgBeacons: (hotspotUuid: string) => Promise<void>;
  fetchHotspotsStatus: (hotspots: string[]) => Promise<void>;
  hotspotsStatus: {
    [key: string]: HotspotStatus;
  };
  hasMoreActivities: boolean;
};

export const HotspotsContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const HotspotsProvider: React.FC<Props> = (props) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [currentHotspot, setCurrentHotspot] = useState<Hotspot | null>(null);
  const [currentHotspotActivities, setCurrentHotspotActivities] =
    useState<HotspotActivity>({
      witnesses: [],
      challengers: [],
      challengees: [],
      rewards: [],
      data_packets: [],
      gateway_data: []
    });
  const [currentHotspotRewards, setCurrentHotspotRewards] = useState<{
    days: number;
    rewards: { [key: string]: number };
    rewards_24h: { [key: string]: number };
  }>({ days: 0, rewards: {}, rewards_24h: {} });
  const [loading, setLoading] = useState<Loading>({
    hotspots: false,
    moreHotspots: false,
    hotspotActivities: false,
    avgBeacons: false
  });
  const [avgBeacons, setAvgBeacons] = useState<number>(0);
  const { setShowGlobalLoading } = useAppearence();
  const [hotspotsStatus, setHotspotsStatus] = useState<{
    [key: string]: HotspotStatus;
  }>({});
  const [hasMoreActivities, setHasMoreActivities] = useState<boolean>(true);

  const fetchHotspotsStatus = useCallback(async (hotspots: string[]) => {
    if (isEmpty(hotspots)) return;

    try {
      const response = await api.post(`v1/hotspots/status`, { hotspots });

      setHotspotsStatus((prevState) => ({
        ...prevState,
        ...keyBy(response.data, "hotspot_id")
      }));
    } catch {}
  }, []);

  const fetchHotspots = useCallback(
    async (page: number) => {
      if (loading.hotspots || loading.moreHotspots) return;

      if (page === 0) {
        setHotspots([]);
        setLoading((prevState) => ({ ...prevState, hotspots: true }));
      }

      if (page > 1) {
        setLoading((prevState) => ({ ...prevState, moreHotspots: true }));
        setShowGlobalLoading(true);
      }

      try {
        const response = await api.get(`v1/hotspots?page=${page}`);

        fetchHotspotsStatus(
          response.data.map((hotspot: Hotspot) => hotspot.address)
        );

        setHotspots((prevState) => [...prevState, ...response.data]);
        setLoading((prevState) => ({
          ...prevState,
          hotspots: false,
          moreHotspots: false
        }));
        setShowGlobalLoading(false);
      } catch {
        setLoading((prevState) => ({
          ...prevState,
          hotspots: false,
          moreHotspots: false
        }));
        setShowGlobalLoading(false);
      }
    },
    [
      fetchHotspotsStatus,
      loading.hotspots,
      loading.moreHotspots,
      setShowGlobalLoading
    ]
  );

  const fetchHotspotRewards = useCallback(
    async (hotspotUuid: string, days: string) => {
      try {
        const response = await api.get(
          `v1/hotspots/rewards/${hotspotUuid}/${days}`
        );
        setCurrentHotspotRewards(response.data);
      } catch {}
    },
    []
  );

  const fetchHotspotAvgBeacons = useCallback(async (hotspotUuid: string) => {
    setLoading((prevState) => ({ ...prevState, avgBeacons: true }));

    try {
      const response = await api.get(`v1/hotspots/avgbeacons/${hotspotUuid}`);

      setAvgBeacons(response.data["7d_average_beacons"]);

      setLoading((prevState) => ({ ...prevState, avgBeacons: false }));
    } catch {
      setLoading((prevState) => ({ ...prevState, avgBeacons: false }));
    }
  }, []);

  const fecthHotspotActivity = useCallback(
    async (hotspotUuid: string | undefined, page: number) => {
      if (!hotspotUuid || loading.hotspotActivities) return;

      setLoading((prevState) => ({ ...prevState, hotspotActivities: true }));

      const limit = 5;

      try {
        const response = await api.get(
          `v1/hotspots/activities/${hotspotUuid}/?limit=${limit}&page=${page}`
        );

        const {
          witnesses,
          challengers,
          challengees,
          rewards,
          data_packets,
          gateway_data
        } = response.data.activity;

        setHasMoreActivities(
          witnesses.length +
            challengers.length +
            challengees.length +
            rewards.length +
            data_packets.length +
            gateway_data.length ===
            limit
        );

        setCurrentHotspotActivities((prevState) => ({
          witnesses: [...prevState.witnesses, ...witnesses],
          challengers: [...prevState.challengers, ...challengers],
          challengees: [...prevState.challengees, ...challengees],
          rewards: [...prevState.rewards, ...rewards],
          data_packets: [...prevState.data_packets, ...data_packets],
          gateway_data: [...prevState.gateway_data, ...gateway_data]
        }));

        setLoading((prevState) => ({ ...prevState, hotspotActivities: false }));
      } catch {
        setLoading((prevState) => ({ ...prevState, hotspotActivities: false }));
      }
    },
    [loading.hotspotActivities]
  );

  const fetchHotspotByUuid = useCallback(
    async (hotspotUuid: string) => {
      setShowGlobalLoading(true);

      try {
        const response = await api.get(`v1/hotspots/${hotspotUuid}`);

        setCurrentHotspot(response.data[0] || null);

        setShowGlobalLoading(false);
      } catch {
        setShowGlobalLoading(false);
      }
    },
    [setShowGlobalLoading]
  );

  const value = useMemo(
    () => ({
      hotspots,
      setHotspots,
      fetchHotspots,
      loading,
      fetchHotspotByUuid,
      currentHotspot,
      currentHotspotActivities,
      fecthHotspotActivity,
      setCurrentHotspotActivities,
      fetchHotspotRewards,
      currentHotspotRewards,
      setCurrentHotspot,
      avgBeacons,
      fetchHotspotAvgBeacons,
      fetchHotspotsStatus,
      hotspotsStatus,
      hasMoreActivities
    }),
    [
      hotspots,
      setHotspots,
      fetchHotspots,
      loading,
      fetchHotspotByUuid,
      currentHotspot,
      currentHotspotActivities,
      fecthHotspotActivity,
      setCurrentHotspotActivities,
      fetchHotspotRewards,
      currentHotspotRewards,
      setCurrentHotspot,
      avgBeacons,
      fetchHotspotAvgBeacons,
      fetchHotspotsStatus,
      hotspotsStatus,
      hasMoreActivities
    ]
  );

  return <HotspotsContext.Provider value={value} {...props} />;
};

export const useHotspots = (): ContextValue => {
  const context = useContext(HotspotsContext);

  if (context === undefined) {
    throw new Error("useHotspots must be used within an HotspotsProvider");
  }

  return context;
};

//
// Utils
//

interface Loading {
  hotspots: boolean;
  moreHotspots: boolean;
  hotspotActivities: boolean;
  avgBeacons: boolean;
}
