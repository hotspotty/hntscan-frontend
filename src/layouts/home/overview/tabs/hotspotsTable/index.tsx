import CountryFlag from "components/countryFlag";
import ExternalLink from "components/externalLink";
import HotspotLink from "components/hotspotLink";
import Table from "components/table";
import moment from "moment";
import Link from "next/link";
import React, { useCallback, useMemo, useRef } from "react";
import useMount from "utils/useMount";
import { useHotspots } from "../../../../../context/hotspots/index";

const HotspotsTable: React.FC = () => {
  const { hotspots, fetchHotspots, loading } = useHotspots();
  const currentPage = useRef(0);

  useMount(() => {
    fetchHotspots(currentPage.current);
    currentPage.current++;

    window.addEventListener("scroll", loadMore);

    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  });

  const loadMore = useCallback(() => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      fetchHotspots(currentPage.current);
      currentPage.current++;
    }
  }, [fetchHotspots]);

  const data = useMemo(
    () =>
      hotspots.map((hotspot) => ({
        hotspot: <HotspotLink hotspotAddress={hotspot.address} withStatus />,
        maker:
          hotspot.maker && hotspot.payer ? (
            <ExternalLink
              url={`https://app.hotspotty.net/hotspots/makers/${hotspot.payer}/statistics`}
              text={hotspot.maker}
            />
          ) : (
            "Unknown maker"
          ),
        location: <CountryFlag location={hotspot.location} />,
        first_timestamp: moment.unix(hotspot.first_timestamp).utc().fromNow(),
        last_activity: hotspot.activity_timestamp ? (
          <Link
            href={`/blockchain/transactions/${hotspot.activity_tx}`}
            passHref
          >
            <span className="text-purple-300 font-medium mr-1 cursor-pointer hover:underline">
              {moment.unix(hotspot.activity_timestamp).utc().fromNow()}
            </span>
          </Link>
        ) : (
          "-"
        )
      })),
    [hotspots]
  );

  return <Table head={header} data={data} loading={loading.hotspots} />;
};

export default HotspotsTable;

//
// Utils
//

const header = [
  {
    key: "hotspot",
    hiddenTitle: false,
    title: "Hotspot"
  },
  {
    key: "maker",
    hiddenTitle: false,
    title: "Maker"
  },
  {
    key: "location",
    hiddenTitle: false,
    title: "Location"
  },
  {
    key: "first_timestamp",
    hiddenTitle: false,
    title: "Onboarded"
  },
  {
    key: "last_activity",
    hiddenTitle: false,
    title: "Last transaction"
  }
];
