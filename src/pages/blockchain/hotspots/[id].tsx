import { ArrowSmUpIcon, PuzzleIcon } from "@heroicons/react/outline";
import { ArrowRightIcon } from "@heroicons/react/solid";
import animalHash from "angry-purple-tiger";
import Box from "components/box";
import Breadcrumbs from "components/breadcrumbs";
import ExternalLink from "components/externalLink";
import HotspotLink from "components/hotspotLink";
import { WifiIcon } from "components/icons/wifi";
import WalletLink from "components/walletLink";
import { useHotspots } from "context/hotspots/index";
import HotspotsOverview from "layouts/hotspots/overview/index";
import { isEmpty } from "lodash";
import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import classNames from "utils/className";
import formatHotspotName from "utils/formatHotspotName";
import { formatTransactionType } from "utils/formatTransactionType";
import { BONES_PER_HNT } from "utils/types/global";
import useMount from "utils/useMount";
import Spinner from "../../../../public/images/spinner.png";

const HotspotDetails: React.FC = () => {
  const {
    fetchHotspotByUuid,
    currentHotspot,
    currentHotspotActivities,
    fecthHotspotActivity,
    setCurrentHotspotActivities,
    setCurrentHotspot,
    loading,
    fetchHotspotAvgBeacons,
    hotspotsStatus,
    fetchHotspotsStatus,
    hasMoreActivities
  } = useHotspots();
  const router = useRouter();
  const currentPage = useRef(0);
  const currentHotspotUuid = useRef("");
  const hasMoreActivitiesRef = useRef(hasMoreActivities);

  useMount(() => {
    window.addEventListener("scroll", loadMore);

    return () => {
      setCurrentHotspotActivities({
        witnesses: [],
        challengers: [],
        challengees: [],
        rewards: [],
        data_packets: [],
        gateway_data: []
      });
      window.removeEventListener("scroll", loadMore);
      setCurrentHotspot(null);
    };
  });

  useEffect(() => {
    hasMoreActivitiesRef.current = hasMoreActivities;
  }, [hasMoreActivities]);

  const loadMore = useCallback(() => {
    if (!hasMoreActivitiesRef.current) return;

    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      fecthHotspotActivity(currentHotspotUuid.current, currentPage.current);
      currentPage.current++;
    }
  }, [fecthHotspotActivity]);

  useEffect(() => {
    if (!router.query.id || typeof router.query.id !== "string") return;

    fetchHotspotByUuid(router.query.id);
    fetchHotspotAvgBeacons(router.query.id);
    fetchHotspotsStatus([router.query.id]);

    currentPage.current = 0;
    setCurrentHotspotActivities({
      witnesses: [],
      challengers: [],
      challengees: [],
      rewards: [],
      data_packets: [],
      gateway_data: []
    });

    fecthHotspotActivity(router.query.id, currentPage.current);

    currentPage.current++;
    currentHotspotUuid.current = router.query.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchHotspotByUuid, router.query.id, setCurrentHotspotActivities]);

  const allActivities = useMemo(() => {
    const data: {
      hash: string;
      title: string | ReactNode;
      time: number;
      subtitle: string | ReactNode;
    }[] = [];

    currentHotspotActivities.rewards.forEach((item) => {
      data.push({
        hash: item.hash,
        title: "Received mining rewards",
        time: item.time,
        subtitle: (
          <b className="ml-1 text-gray-300 text-sm font-normal">
            +{item.amount / BONES_PER_HNT} HNT
          </b>
        )
      });
    });

    currentHotspotActivities.witnesses.forEach((item) => {
      data.push({
        hash: item.hash,
        title: item.beaconer_location || "Witness Beacon",
        time: item.time,
        subtitle: (
          <span className="ml-1">
            by{" "}
            <HotspotLink
              hotspotAddress={item.beaconer}
              className="inline-flex"
            />
          </span>
        )
      });
    });

    currentHotspotActivities.challengees.forEach((item) => {
      data.push({
        hash: item.hash,
        title: (
          <span>
            Sent beacon{" "}
            <span className="text-gray-300 text-sm font-normal">
              with {item.valid_count} valid and {item.invalid_count} invalid
              witnesses
            </span>
          </span>
        ),
        subtitle: (
          <span className="ml-1">
            from <b>{item.beaconer_location}</b>
          </span>
        ),
        time: item.time
      });
    });

    currentHotspotActivities.challengers.forEach((item) => {
      data.push({
        hash: item.hash,
        title: (
          <span>
            Sent beacon{" "}
            <span className="text-gray-300 text-sm font-normal">
              with {item.valid_count} valid and {item.invalid_count} invalid
              witnesses
            </span>
          </span>
        ),
        subtitle: (
          <span className="ml-1">
            from <b>{item.beaconer_location}</b>
          </span>
        ),
        time: item.time
      });
    });

    currentHotspotActivities.gateway_data.forEach((item) => {
      data.push({
        hash: item.hash,
        title: <span>{formatTransactionType(item.type)}</span>,
        subtitle: <HotspotLink hotspotAddress={item.gateway} />,
        time: item.timestamp
      });
    });

    return data.sort((a, b) => b.time - a.time);
  }, [currentHotspotActivities]);

  return (
    <div className="w-full mobile:w-11/12 mt-0 pb-32">
      <Head>
        <title>
          HNTScan - Hotspot -{" "}
          {router.query.id ? animalHash(router.query.id as string) : ""}
        </title>
      </Head>

      <div className="w-full mt-24 mobile:hidden">
        <Breadcrumbs />
      </div>

      <div className="mobile:mt-8 mt-20">
        <h3 className="mobile:text-2xl text-4xl font-semibold flex items-center">
          {currentHotspot && !!hotspotsStatus[currentHotspot.address] ? (
            <span
              className={classNames(
                "w-6 h-6 flex-shrink-0 rounded-full mr-3",
                hotspotsStatus[currentHotspot.address]
                  ? "bg-green-300"
                  : "bg-red-300"
              )}
            />
          ) : (
            <span className="w-6 h-6 flex-shrink-0 rounded-full mr-3 animate-pulse bg-gray-300" />
          )}

          {currentHotspot ? (
            formatHotspotName(currentHotspot.name)
          ) : (
            <div className="w-72 rounded h-[30px] lg:h-[40px] animate-pulse bg-gray-300 flex" />
          )}
        </h3>

        <div className="mt-2 flex items-center mobile:flex-col mobile:items-start gap-5">
          <WalletLink walletAddress={currentHotspot?.owner} />

          <span className="text-sm font-semibold flex items-center">
            <PuzzleIcon className="w-6" />

            {currentHotspot ? (
              currentHotspot.maker && currentHotspot.payer ? (
                <ExternalLink
                  className="mx-2"
                  url={`https://app.hotspotty.net/hotspots/makers/${currentHotspot.payer}/statistics`}
                  text={currentHotspot.maker}
                />
              ) : (
                <span className="mx-2">Unknown maker</span>
              )
            ) : (
              <div className="mx-2 w-28 rounded h-4 animate-pulse bg-gray-300 flex" />
            )}
          </span>

          <span className="text-sm font-semibold flex items-center mobile:my-2">
            <WifiIcon />
            <span className="mx-2">
              {currentHotspot ? (
                <span>{currentHotspot ? currentHotspot.gain / 10 : 0}dBi</span>
              ) : (
                <div className="mx-2 w-16 rounded h-4 animate-pulse bg-gray-300 flex" />
              )}
            </span>
          </span>

          <span className="text-sm font-semibold flex items-center mobile:my-2">
            <ArrowSmUpIcon className="w-6" />
            <span className="mx-2">
              {currentHotspot ? (
                <span>{currentHotspot ? currentHotspot.elevation : 0}m</span>
              ) : (
                <div className="mx-2 w-16 rounded h-4 animate-pulse bg-gray-300 flex" />
              )}
            </span>
          </span>
        </div>
      </div>

      <Box className="mt-10">
        <div className="w-full">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
            <p className="text-xl font-semibold">Overview</p>
          </div>
          <HotspotsOverview />
        </div>
      </Box>

      <Box className="mt-6">
        <>
          <div className="flex items-center">
            <p className="text-xl font-semibold">Recent activity</p>
          </div>
          <div className="w-full pr-4">
            {!loading.hotspotActivities && isEmpty(allActivities) ? (
              <span className="mt-4 text-sm w-full flex justify-center items-center">
                No Activities
              </span>
            ) : (
              <>
                {allActivities.map((activity, index) => (
                  <div key={index} className="flex justify-between mt-6">
                    <div className="flex mobile:flex-col">
                      <h4 className="text-sm font-bold text-white mobile:text-sm">
                        {activity.title}
                      </h4>

                      <span className="text-sm">{activity.subtitle}</span>
                    </div>

                    <div className="text-right text-sm whitespace-nowrap">
                      {!!activity.time && (
                        <div className="text-gray-300">
                          {moment.unix(activity.time).utc().fromNow()}
                        </div>
                      )}
                      <div className="float-right">
                        <Link
                          href={`/blockchain/transactions/${activity.hash}`}
                          passHref
                        >
                          <b className="text-purple-300 cursor-pointer hover:underline flex items-center">
                            Details
                            <ArrowRightIcon className="h-3 w-3 inline ml-1" />
                          </b>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {loading.hotspotActivities && (
              <div className="pt-5 pb-10 w-10 h-10 mx-auto">
                <Image
                  src={Spinner}
                  alt="spinner"
                  className="animate-spin-linear"
                />
              </div>
            )}
          </div>
        </>
      </Box>
    </div>
  );
};

export default HotspotDetails;
