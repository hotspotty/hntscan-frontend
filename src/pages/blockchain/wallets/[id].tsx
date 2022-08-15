import Box from "components/box";
import Breadcrumbs from "components/breadcrumbs";
import AreaChart from "components/charts/areaChart";
import { Duplicate } from "components/icons/duplicate";
import { QrCodeIcon } from "components/icons/qrCodeIcon";
import LineTabs from "components/lineTabs";
import { useHotspots } from "context/hotspots";
import { useWallets } from "context/wallets/index";
import Hotspots from "layouts/wallet/hotspots";
import WalletBalanceOverview from "layouts/wallet/overview";
import Validators from "layouts/wallet/validators";
import { isEmpty, keys, values } from "lodash";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import copyToClipboard from "utils/copyToClipboard";
import truncateText from "utils/truncateText";
import useMount from "utils/useMount";
import { BONES_PER_HNT } from "../../../utils/types/global";

const WalletDetails: React.FC = () => {
  const {
    fetchWalletByUuid,
    currentWallet,
    setCurrentWallet,
    setCurrentWalletHotspots,
    setCurrentWalletValidators,
    fetchWalletHotspots,
    fetchWalletValidators,
    currentWalletHotspots
  } = useWallets();
  const { fetchHotspotsStatus } = useHotspots();
  const [currentTab, setCurrentTab] = useState("Balance");
  const [days, setDays] = useState("30");
  const router = useRouter();

  useMount(() => {
    return () => {
      setCurrentWallet(null);
      setCurrentWalletHotspots([]);
      setCurrentWalletValidators([]);
    };
  });

  const overViewTabs = useMemo(
    () => [
      {
        key: "Balance",
        title: "Balance",
        count: 0
      },
      {
        key: "Hotspots",
        title: "Hotspots",
        count: currentWallet?.hotspot_count || 0
      },
      {
        key: "Validators",
        title: "Validators",
        count: currentWallet?.validator_count || 0
      }
    ],
    [currentWallet?.hotspot_count, currentWallet?.validator_count]
  );

  const chartData = useMemo(() => {
    let data: { [key: string]: { y: number; name: string } } = {};

    if (!currentWallet) return [];

    const currentData =
      days === "1" ? currentWallet.rewards_24h : currentWallet.rewards;

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
  }, [currentWallet, days]);

  useEffect(() => {
    if (typeof router.query.id !== "string") return;

    fetchWalletByUuid(router.query.id);
  }, [fetchWalletByUuid, router.query.id]);

  const handleTab = useCallback(
    (item: string) => {
      if (item === "Hotspots") {
        fetchWalletHotspots(router.query.id as string);
      }

      if (item === "Validators") {
        fetchWalletValidators(router.query.id as string);
      }

      setCurrentTab(item);
    },
    [fetchWalletHotspots, fetchWalletValidators, router.query.id]
  );

  useEffect(() => {
    if (isEmpty(currentWalletHotspots)) return;

    fetchHotspotsStatus(
      currentWalletHotspots.map((hotspot) => hotspot.address)
    );
  }, [currentWalletHotspots, fetchHotspotsStatus]);

  return (
    <div className="w-full mobile:w-11/12 mt-0 pb-36 mobile:pb-32">
      <Head>
        <title>HNTScan - Wallets {router.query.id}</title>
      </Head>

      <div className="w-full mt-24 mobile:hidden">
        <Breadcrumbs />
      </div>

      <div className="mobile:mt-8 mt-20">
        <h3 className="mobile:text-2xl text-4xl font-bold">Wallet Details</h3>

        <div className="flex items-center mobile:flex-wrap mt-2">
          <span className="text-sm font-bold flex items-center mobile:mr-5 mr-8">
            <QrCodeIcon className="flex-shrink-0" />

            {router.query.id ? (
              <>
                <span className="truncate ml-2 mr-1">
                  <pre>{truncateText(router.query.id as string, 20)}</pre>
                </span>
                <button
                  onClick={() => copyToClipboard(router.query.id as string)}
                >
                  <Duplicate className="flex-shrink-0" width={18} />
                </button>
              </>
            ) : (
              <div className="mx-2 w-28 rounded h-4 animate-pulse bg-gray-300 flex" />
            )}
          </span>
        </div>
      </div>
      <Box className="w-full h-full relative ease-in-out duration-500 mt-10 min-h-[627px] px-4">
        <div className="w-full">
          <LineTabs
            sectionName="balance"
            items={overViewTabs}
            current={currentTab}
            setCurrent={(current) => handleTab(current)}
          />

          {currentTab === "Balance" && (
            <div className="flex flex-col">
              <WalletBalanceOverview />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                <div className="lg:col-span-3">
                  <AreaChart
                    days={days}
                    onChangeDays={setDays}
                    isDateActive={true}
                    series={[
                      {
                        data: isEmpty(chartData)
                          ? [0, 0, 0, 0, 0, 0, 0]
                          : chartData,
                        name: "HNT Rewards"
                      }
                    ]}
                  />
                </div>

                <div className="flex items-start justify-start mt-6">
                  <div className="p-2 bg-white rounded-md">
                    <QRCode value={currentWallet?.address || ""} size={100} />
                  </div>
                  <div className="pl-4 max-w-[320px]">
                    <p className="text-sm text-gray-300">
                      HNT can be sent to this account using the QR feature in
                      the Helium App.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === "Hotspots" && <Hotspots />}

          {currentTab === "Validators" && <Validators />}
        </div>
      </Box>
    </div>
  );
};

export default WalletDetails;
