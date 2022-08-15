import { PencilAltIcon } from "@heroicons/react/outline";
import { TagIcon } from "@heroicons/react/solid";
import BlockLink from "components/blockLink";
import Box from "components/box";
import Breadcrumbs from "components/breadcrumbs";
import ExternalLink from "components/externalLink";
import HotspotLink from "components/hotspotLink";
import { Clock } from "components/icons/clock";
import { Cube } from "components/icons/cube";
import { EyeIcon } from "components/icons/eye";
import ShortenedString from "components/shortenedString";
import ValidatorLink from "components/validatorLink";
import WalletLink from "components/walletLink";
import { useStatistics } from "context/statistics";
import { useTransactions } from "context/transactions/index";
import { Base64 } from "js-base64";
import { processBonesBalance } from "layouts/wallet/overview";
import {
  capitalize,
  get,
  isEmpty,
  keys,
  map,
  omit,
  sumBy,
  upperCase
} from "lodash";
import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import classNames from "utils/className";
import formatBytes from "utils/formatBytes";
import formatLargeNumber from "utils/formatLargeNumber";
import { formatTransactionType } from "utils/formatTransactionType";
import formatVersion from "utils/formatVersion";
import { AssertLocationV2 } from "utils/types/transactions";
import useMount from "utils/useMount";
import Spinner from "../../../../public/images/spinner.png";

const TransactionDetails: React.FC = () => {
  const {
    currentTransaction,
    fetchTransactionByUuid,
    currentTransactionDetails,
    setTxnsRewards,
    setCurrentTransaction,
    fetchTxnsRewards,
    txnsRewards,
    loading
  } = useTransactions();
  const { stats } = useStatistics();
  const router = useRouter();
  const currentPage = useRef(0);
  const currentTransactionUuid = useRef("");

  const loadMore = useCallback(() => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      fetchTxnsRewards(currentTransactionUuid.current, currentPage.current);
      currentPage.current++;
    }
  }, [fetchTxnsRewards]);

  const isRewardsType = useMemo(
    () =>
      currentTransactionDetails &&
      ["rewards_v1", "rewards_v2", "rewards_v3"].includes(
        currentTransactionDetails.data_type
      ),
    [currentTransactionDetails]
  );

  useEffect(() => {
    window.removeEventListener("scroll", loadMore);

    if (!isRewardsType) {
      return;
    }

    window.addEventListener("scroll", loadMore);
  }, [isRewardsType, loadMore, setCurrentTransaction, setTxnsRewards]);

  React.useEffect(() => {
    console.log(currentTransactionDetails);
  }, [currentTransactionDetails]);

  useMount(() => {
    return () => {
      setTxnsRewards([]);
      window.removeEventListener("scroll", loadMore);
      setCurrentTransaction(null);
      currentTransactionUuid.current = "";
      currentPage.current = 0;
    };
  });

  const witnesses = useMemo(() => {
    if (
      !currentTransactionDetails ||
      !(
        currentTransactionDetails?.data_type === "poc_receipts_v1" ||
        currentTransactionDetails?.data_type === "poc_receipts_v2"
      ) ||
      isEmpty(currentTransactionDetails.path.witnesses)
    ) {
      return [];
    }

    return currentTransactionDetails.path.witnesses.map((witness) => ({
      hotspot_id: witness.gateway,
      is_valid: witness.is_valid,
      witnesses: [
        // {
        //   name: "Distance",
        //   value: "123" // TODO: Calculate distance between challengee location (center of h3) and witness location. See https://github.com/helium/explorer/blob/a3a70cfa65923bdde0ea02ad1e6025f1148639a6/components/Lists/WitnessedList.js#L66
        // },
        {
          name: "Datarate",
          value: witness.datarate
        },
        {
          name: "RSSI",
          value: witness.signal + "dBm"
        },
        {
          name: "SNR",
          value: witness.snr
        },
        {
          name: "Frequency",
          value: witness.frequency.toFixed(1) + "MHz"
        }
      ]
    }));
  }, [currentTransactionDetails]);

  const overviewItems = useMemo(() => {
    switch (currentTransactionDetails?.data_type) {
      case "poc_receipts_v1":
      case "poc_receipts_v2":
        return [
          {
            type: "Challenger (validator)",
            description: (
              <ValidatorLink
                validatorAddress={currentTransactionDetails.challenger}
              />
            )
          },
          {
            type: "Challengee (hotspot)",
            description: (
              <HotspotLink
                hotspotAddress={currentTransactionDetails.path.challengee}
              />
            )
          }
        ];
      case "consensus_group_v1":
        return [
          {
            type: "Members",
            description: currentTransactionDetails.members.length
          },
          {
            type: "Delay",
            description: currentTransactionDetails.delay
          },
          {
            type: "Proof",
            description: currentTransactionDetails.proof ? (
              <ShortenedString string={currentTransactionDetails.proof} />
            ) : (
              "-"
            )
          }
        ];
      case "validator_heartbeat_v1":
        return [
          {
            type: "Validator",
            description: (
              <ValidatorLink
                validatorAddress={currentTransactionDetails.address}
              />
            )
          },
          {
            type: "Signature",
            description: (
              <ShortenedString string={currentTransactionDetails.signature} />
            )
          },
          {
            type: "Version",
            description: formatVersion(currentTransactionDetails.version)
          },
          {
            type: "Raw Version Text",
            description: currentTransactionDetails.version
          }
        ];
      case "payment_v1":
        return [
          {
            type: "Payer",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payer} />
            )
          },
          {
            type: "Payee",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payee} />
            )
          },
          {
            type: "Amount",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.amount)
              ) + " HNT"
          },
          {
            type: "Fee",
            description: currentTransactionDetails.fee
          }
        ];
      case "payment_v2":
        return [
          {
            type: "Payer",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payer} />
            )
          },
          {
            type: "Amount",
            description:
              formatLargeNumber(
                processBonesBalance(
                  sumBy(currentTransactionDetails.payments, "amount")
                )
              ) + " HNT"
          },
          {
            type: "Fee",
            description: currentTransactionDetails.fee
          }
        ];
      case "transfer_validator_stake_v1":
        return [
          {
            type: "New validator",
            description: (
              <ValidatorLink
                validatorAddress={currentTransactionDetails.new_address}
              />
            )
          },
          {
            type: "Old validator",
            description: (
              <ValidatorLink
                validatorAddress={currentTransactionDetails.old_address}
              />
            )
          },
          {
            type: "Old owner",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.old_owner} />
            )
          },
          {
            type: "Old owner signature",
            description: (
              <ShortenedString
                string={currentTransactionDetails.old_owner_signature}
              />
            )
          },
          {
            type: "Stake",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.stake_amount)
              ) + " HNT"
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "dc_coinbase_v1":
        return [
          {
            type: "Payee",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payee} />
            )
          },
          {
            type: "Amount",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.amount)
              ) + " HNT"
          }
        ];
      case "rewards_v1":
      case "rewards_v2":
      case "rewards_v3": {
        type rewardType = { type: string; count: number; amount: number };
        const rewardTypes: rewardType[] = [];

        keys(currentTransactionDetails).forEach((key) => {
          if (key.endsWith("_amount")) {
            const rewardType = key.replace("_amount", "");
            const rewardTypeItems = get(
              currentTransactionDetails,
              rewardType,
              0
            );
            if (rewardTypeItems > 0) {
              rewardTypes.push({
                type: rewardType,
                count: rewardTypeItems,
                amount: get(currentTransactionDetails, key, 0)
              });
            }
          }
        });

        return [
          {
            type: "Start epoch",
            description: (
              <BlockLink blockHeight={currentTransactionDetails.start_epoch} />
            )
          },
          {
            type: "End epoch",
            description: (
              <BlockLink blockHeight={currentTransactionDetails.end_epoch} />
            )
          },
          {
            type: "Reward items",
            description: formatLargeNumber(sumBy(rewardTypes, "count"))
          },
          {
            type: "Total rewards",
            description:
              formatLargeNumber(
                processBonesBalance(sumBy(rewardTypes, "amount"))
              ) + " HNT"
          },
          ...rewardTypes.map(({ type, count, amount }) => ({
            type: type.split("_").map(capitalize).join(" "),
            description: (
              <>
                <div>{formatLargeNumber(processBonesBalance(amount))} HNT</div>
                <div className="text-sm font-normal text-gray-300">
                  {formatLargeNumber(count, 0)} item{count === 1 ? "" : "s"}
                </div>
              </>
            )
          }))
        ];
      }
      case "assert_location_v1":
      case "assert_location_v2":
        [
          {
            type: "Asserted hotspot",
            description: (
              <HotspotLink hotspotAddress={currentTransactionDetails.gateway} />
            )
          },
          {
            type: "Asserted hotspot owner",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.owner} />
            )
          },
          {
            type: "Staking fee",
            description:
              formatLargeNumber(currentTransactionDetails.staking_fee) + " DC"
          },
          {
            type: "Staking fee payer",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payer} />
            )
          },
          {
            type: "Asserted location (h3 res 12)",
            description: (
              <ExternalLink
                url={`https://app.hotspotty.net/hotspots/${currentTransactionDetails.gateway}/status`}
                text={currentTransactionDetails.location}
              />
            )
          },
          {
            type: "Antenna gain",
            description: (currentTransactionDetails as AssertLocationV2).gain
              ? `${
                  (currentTransactionDetails as AssertLocationV2).gain / 10
                }dBi`
              : "-"
          },
          {
            type: "Installation height",
            description: (currentTransactionDetails as AssertLocationV2)
              .elevation
              ? `${(currentTransactionDetails as AssertLocationV2).elevation}m`
              : "-"
          },
          {
            type: "Nonce",
            description: currentTransactionDetails.nonce
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "add_gateway_v1":
        return [
          {
            type: "Added hotspot",
            description: (
              <HotspotLink hotspotAddress={currentTransactionDetails.gateway} />
            )
          },
          {
            type: "Transaction fee",
            description: formatLargeNumber(currentTransactionDetails.fee)
          },
          {
            type: "Staking fee",
            description:
              formatLargeNumber(currentTransactionDetails.staking_fee) + " DC"
          },
          {
            type: "Staking fee payer",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payer} />
            )
          }
        ];
      case "transfer_hotspot_v1":
        return [
          {
            type: "Transferred hotspot",
            description: (
              <HotspotLink hotspotAddress={currentTransactionDetails.gateway} />
            )
          },
          {
            type: "Seller",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.seller} />
            )
          },
          {
            type: "Buyer",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.buyer} />
            )
          },
          {
            type: "Payment to seller",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.amount_to_seller)
              ) + " HNT"
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "transfer_hotspot_v2":
        return [
          {
            type: "Transferred hotspot",
            description: (
              <HotspotLink hotspotAddress={currentTransactionDetails.gateway} />
            )
          },
          {
            type: "Owner",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.owner} />
            )
          },
          {
            type: "New owner",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.new_owner} />
            )
          },
          {
            type: "Nonce",
            description: currentTransactionDetails.nonce
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "token_burn_v1":
        return [
          {
            type: "Payer",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payer} />
            )
          },
          {
            type: "Payee",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payee} />
            )
          },
          {
            type: "Amount burned",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.amount)
              ) + " HNT"
          }, // TODO: add Oracle Price and Value like this: https://github.com/helium/explorer/blob/v2/components/InfoBox/TxnDetails/TokenBurnV1.js
          {
            type: "Memo",
            description:
              currentTransactionDetails.memo === DEFAULT_PAYMENT_MEMO
                ? "-"
                : Base64.decode(currentTransactionDetails.memo)
          },
          {
            type: "Nonce",
            description: currentTransactionDetails.nonce
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "unstake_validator_v1":
        return [
          {
            type: "Validator",
            description: (
              <ValidatorLink
                validatorAddress={currentTransactionDetails.address}
              />
            )
          },
          {
            type: "Owner",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.owner} />
            )
          },
          {
            type: "Owner signature",
            description: (
              <ShortenedString
                string={currentTransactionDetails.owner_signature}
              />
            )
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          },
          {
            type: "Stake amount",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.stake_amount)
              ) + " HNT"
          },
          {
            type: "Stake release block",
            description:
              stats &&
              stats.block.height >
                currentTransactionDetails.stake_release_height ? (
                <BlockLink
                  blockHeight={currentTransactionDetails.stake_release_height}
                />
              ) : (
                `#${currentTransactionDetails.stake_release_height}`
              )
          },
          {
            type: "Latest block",
            description: <BlockLink blockHeight={stats?.block.height} />
          },
          {
            type: "Approximate release time",
            description: stats?.block.height
              ? stats.block.height >
                currentTransactionDetails.stake_release_height
                ? "Stake released"
                : `${(
                    currentTransactionDetails.stake_release_height -
                    stats.block.height
                  ).toLocaleString()} blocks remaining`
              : "-"
          }
        ];
      case "stake_validator_v1":
        return [
          {
            type: "Validator",
            description: (
              <ValidatorLink
                validatorAddress={currentTransactionDetails.address}
              />
            )
          },
          {
            type: "Owner",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.owner} />
            )
          },
          {
            type: "Owner signature",
            description: (
              <ShortenedString
                string={currentTransactionDetails.owner_signature}
              />
            )
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          },
          {
            type: "Stake amount",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.stake)
              ) + " HNT"
          }
        ];
      case "state_channel_close_v1": {
        let totalPackets = 0;
        let totalDcs = 0;
        let totalBytes = 0;
        currentTransactionDetails.state_channel.summaries.forEach((s) => {
          totalPackets += s.num_packets;
          totalDcs += s.num_dcs;
          totalBytes += s.num_dcs * 24;
        });

        return [
          { type: "Total packets", description: totalPackets.toLocaleString() },
          { type: "Total data", description: formatBytes(totalBytes) },
          { type: "Total DC spent", description: totalDcs.toLocaleString() },
          {
            type: "Number of hotspots",
            description:
              currentTransactionDetails.state_channel.summaries.length.toLocaleString()
          },
          {
            type: "State channel ID",
            description: (
              <ShortenedString
                string={currentTransactionDetails.state_channel.id}
              />
            )
          },
          {
            type: "State channel closer",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.closer} />
            )
          },
          {
            type: "State channel owner",
            description: (
              <WalletLink
                walletAddress={currentTransactionDetails.state_channel.owner}
              />
            )
          }
        ];
      }
      case "state_channel_open_v1":
        return [
          {
            type: "State channel owner",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.owner} />
            )
          },

          { type: "OUI", description: currentTransactionDetails.oui },
          { type: "Nonce", description: currentTransactionDetails.nonce },
          {
            type: "Expire within",
            description: `${currentTransactionDetails.expire_within} blocks`
          },
          {
            type: "Amount",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.amount)
              ) + " HNT"
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          },
          {
            type: "State channel ID",
            description: (
              <ShortenedString string={currentTransactionDetails.id} />
            )
          }
        ];
      case "security_exchange_v1":
        return [
          {
            type: "Payer",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payer} />
            )
          },
          {
            type: "Payee",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payee} />
            )
          },
          {
            type: "Amount",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.amount)
              ) + " HNT"
          },
          {
            type: "Nonce",
            description: currentTransactionDetails.nonce
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "oui_v1":
        return [
          {
            type: "Owner",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.owner} />
            )
          },
          {
            type: "OUI",
            description: currentTransactionDetails.oui
          },
          {
            type: "Requested subnet size",
            description: currentTransactionDetails.requested_subnet_size
          },
          {
            type: "Filter",
            description: (
              <ShortenedString string={currentTransactionDetails.filter} />
            )
          },
          {
            type: "Staking fee",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.staking_fee)
              ) + " HNT" // Not sure if it's in DC or HNT
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "subnetwork_rewards_v1":
        return [
          {
            type: "Token type",
            description: upperCase(currentTransactionDetails.token_type)
          },
          {
            type: "Total rewards",
            description:
              formatLargeNumber(
                processBonesBalance(
                  sumBy(currentTransactionDetails.rewards, "amount")
                )
              ) +
              " " +
              upperCase(currentTransactionDetails.token_type)
          },
          {
            type: "Start epoch",
            description: (
              <BlockLink blockHeight={currentTransactionDetails.start_epoch} />
            )
          },
          {
            type: "End epoch",
            description: (
              <BlockLink blockHeight={currentTransactionDetails.end_epoch} />
            )
          }
        ];
      case "token_redeem_v1":
        return [
          {
            type: "Wallet",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.account} />
            )
          },
          {
            type: "Token type",
            description: upperCase(currentTransactionDetails.token_type)
          },
          {
            type: "Amount",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.amount)
              ) +
              " " +
              upperCase(currentTransactionDetails.token_type)
          },
          {
            type: "Nonce",
            description: currentTransactionDetails.nonce
          }
        ];
      case "security_coinbase_v1":
        return [
          {
            type: "Payee",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payee} />
            )
          },
          {
            type: "Amount",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.amount)
              ) + " HNT"
          }
        ];
      case "gen_gateway_v1":
        return [
          {
            type: "Hotspot",
            description: (
              <HotspotLink hotspotAddress={currentTransactionDetails.gateway} />
            )
          },
          {
            type: "Owner",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.owner} />
            )
          },
          {
            type: "Asserted location (h3 res 12)",
            description: (
              <ExternalLink
                url={`https://app.hotspotty.net/hotspots/${currentTransactionDetails.gateway}/status`}
                text={currentTransactionDetails.location}
              />
            )
          },
          {
            type: "Nonce",
            description: currentTransactionDetails.nonce
          }
        ];
      case "routing_v1":
        return [
          {
            type: "Owner",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.owner} />
            )
          },
          {
            type: "Action",
            description: currentTransactionDetails.action.action
          },
          {
            type: "Action index",
            description: currentTransactionDetails.action.index
          },
          {
            type: "Action filter",
            description: (
              <ShortenedString
                string={currentTransactionDetails.action.filter}
              />
            )
          },
          {
            type: "OUI",
            description: currentTransactionDetails.oui
          },
          {
            type: "Nonce",
            description: currentTransactionDetails.nonce
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "create_htlc_v1":
        return [
          {
            type: "Amount",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.amount)
              ) + " HNT" // Not sure if it's in DC or HNT
          },
          {
            type: "Payer",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payer} />
            )
          },
          {
            type: "Payee",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payee} />
            )
          },
          {
            type: "Address",
            description: (
              <ShortenedString string={currentTransactionDetails.address} />
            )
          },
          {
            type: "Hashlock",
            description: (
              <ShortenedString string={currentTransactionDetails.hashlock} />
            )
          },
          {
            type: "Timelock",
            description: currentTransactionDetails.timelock
          },
          {
            type: "Nonce",
            description: currentTransactionDetails.nonce
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "redeem_htlc_v1":
        return [
          {
            type: "Payee",
            description: (
              <WalletLink walletAddress={currentTransactionDetails.payee} />
            )
          },
          {
            type: "Address",
            description: (
              <ShortenedString string={currentTransactionDetails.address} />
            )
          },
          {
            type: "Preimage",
            description: <pre>{currentTransactionDetails.preimage}</pre>
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "poc_request_v1":
        return [
          {
            type: "Challenger hotspot",
            description: (
              <HotspotLink
                hotspotAddress={currentTransactionDetails.challenger}
              />
            )
          },
          {
            type: "Challenger owner",
            description: (
              <WalletLink
                walletAddress={currentTransactionDetails.challenger_owner}
              />
            )
          },
          {
            type: "Secret hash",
            description: (
              <ShortenedString string={currentTransactionDetails.secret_hash} />
            )
          },
          {
            type: "Onion key hash",
            description: (
              <ShortenedString
                string={currentTransactionDetails.onion_key_hash}
              />
            )
          },
          {
            type: "Block hash",
            description: (
              <ShortenedString string={currentTransactionDetails.block_hash} />
            )
          },
          {
            type: "Version",
            description: currentTransactionDetails.version
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "vars_v1":
        return [
          {
            type: "Master key",
            description: currentTransactionDetails.master_key ? (
              <ShortenedString string={currentTransactionDetails.master_key} />
            ) : (
              "-"
            )
          },
          {
            type: "Proof",
            description: currentTransactionDetails.proof ? (
              <ShortenedString string={currentTransactionDetails.proof} />
            ) : (
              "-"
            )
          },
          {
            type: "Key proof",
            description: currentTransactionDetails.key_proof ? (
              <ShortenedString string={currentTransactionDetails.key_proof} />
            ) : (
              "-"
            )
          },
          {
            type: "Nonce",
            description: currentTransactionDetails.nonce
          },
          {
            type: "Version predicate",
            description: currentTransactionDetails.version_predicate
          },
          {
            type: "Cancels",
            description: isEmpty(currentTransactionDetails.cancels)
              ? "-"
              : currentTransactionDetails.cancels.map((cancelledVar) => (
                  <div key={cancelledVar}>{cancelledVar}</div>
                ))
          },
          {
            type: "Unsets",
            description: isEmpty(currentTransactionDetails.unsets)
              ? "-"
              : currentTransactionDetails.unsets.map((unset) => (
                  <div key={unset}>{unset}</div>
                ))
          }
        ];
      case "price_oracle_v1":
        return [
          {
            type: "Price",
            description:
              formatLargeNumber(
                processBonesBalance(currentTransactionDetails.price)
              ) + " USD"
          },
          {
            type: "Public key",
            description: (
              <ShortenedString string={currentTransactionDetails.public_key} />
            )
          },
          {
            type: "Fee",
            description:
              formatLargeNumber(currentTransactionDetails.fee) + " DC"
          }
        ];
      case "consensus_group_failure_v1":
        return [
          {
            type: "Members",
            description: currentTransactionDetails.members.map((validator) => (
              <ValidatorLink key={validator} validatorAddress={validator} />
            ))
          },
          {
            type: "Signatures",
            description: currentTransactionDetails.signatures.map(
              (signature) => (
                <ShortenedString key={signature} string={signature} />
              )
            )
          },
          {
            type: "Failed members",
            description: currentTransactionDetails.failed_members.map(
              (validator) => (
                <ValidatorLink key={validator} validatorAddress={validator} />
              )
            )
          },
          { type: "Delay", description: currentTransactionDetails.delay }
        ];
      default:
        return map(
          omit(currentTransactionDetails, [
            "hash",
            "height",
            "type",
            "data_type"
          ]),
          (value, key) => ({
            type: key.split("_").map(capitalize).join(" "),
            description: <span title={value}>{value}</span>
          })
        );
    }
  }, [currentTransactionDetails, stats]);

  useEffect(() => {
    if (!isRewardsType || !currentTransactionUuid.current) {
      return;
    }

    currentPage.current = 0;

    fetchTxnsRewards(currentTransactionUuid.current, currentPage.current);

    currentPage.current++;
  }, [fetchTxnsRewards, isRewardsType]);

  useEffect(() => {
    if (!router.query.id || typeof router.query.id !== "string") return;

    fetchTransactionByUuid(router.query.id);
    currentTransactionUuid.current = router.query.id;
  }, [fetchTransactionByUuid, router.query.id]);

  return (
    <div className="w-full mobile:w-11/12 mt-0 pb-32">
      <Head>
        <title>HNTScan - Transations {router.query.id}</title>
      </Head>

      <div className="w-full mt-24 mobile:hidden">
        <Breadcrumbs />
      </div>

      <div className="mobile:mt-8 mt-20">
        <h3 className="mobile:text-2xl text-4xl font-semibold flex items-center">
          <span className="mr-1">
            {formatTransactionType(currentTransaction?.type || "")}
          </span>
          Transaction
        </h3>

        <div className="mt-2 flex items-center mobile:flex-col mobile:items-start">
          <span className="text-sm font-medium flex items-center mobile:mr-0 mr-5">
            <Clock />
            <span className="mx-2 mobile:text-xs">
              {moment
                .unix(currentTransaction?.time || 0)
                .format("DD MMM YYYY, hh:mm a")}
            </span>
          </span>

          <span className="text-sm font-medium flex items-center mobile:mr-0 mobile:my-2 mr-5 mobile:w-full">
            <Cube />
            <span className="mx-2 mobile:text-xs mobile:w-fit">
              <BlockLink blockHeight={currentTransaction?.height} />
            </span>
          </span>

          <span className="text-sm font-medium flex items-center mobile:mr-0 mr-5 mobile:w-full">
            <TagIcon className="w-6" />
            <span className="mx-2 mobile:text-xs mobile:w-fit">
              {currentTransaction?.type}
            </span>
          </span>
        </div>

        <Box className="ease-in-out duration-500 mt-10 px-4">
          <div className="w-full">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <p className="text-xl font-semibold">Overview</p>
            </div>

            <div className="pt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {overviewItems?.map((item, index) => (
                <div key={index} className="flex flex-col pb-5 last:pb-0">
                  <span className="text-sm">{item.type}</span>
                  <span className="font-bold my-1 mobile:text-lg lg:mr-3 flex items-center w-full">
                    <span className="truncate w-full">{item.description}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Box>

        {witnesses.length > 0 && (
          <Box className="mt-8">
            <div>
              {currentTransactionDetails?.data_type === "poc_receipts_v1" ||
                (currentTransactionDetails?.data_type === "poc_receipts_v2" && (
                  <div className="flex items-center border-b border-gray-200 pb-3">
                    <EyeIcon />

                    <span className="ml-2 text-xl font-semibold">
                      {currentTransactionDetails?.path?.witnesses?.length}{" "}
                      <span>Witnesses</span>
                    </span>
                  </div>
                ))}

              {witnesses.map((item, key) => (
                <div key={key} className="w-full mt-6">
                  <div className="flex justify-between items-center">
                    <HotspotLink hotspotAddress={item.hotspot_id} />

                    <span
                      className={classNames(
                        "text-xs uppercase font-bold rounded-full px-3 py-0.5",
                        item.is_valid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {item.is_valid ? "Valid" : "Invalid"}
                    </span>
                  </div>

                  {item.witnesses.map((witness, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center mt-3"
                    >
                      <h4 className="font-medium text-sm text-gray-300">
                        {witness.name}
                      </h4>

                      <span className="font-bold text-white">
                        {witness.value}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Box>
        )}

        {isRewardsType && (
          <Box className="mt-8">
            <div>
              <div className="text-xl font-semibold border-b border-gray-200 pb-3">
                Rewards
              </div>

              {txnsRewards?.map((rewards, key) => (
                <div
                  key={key}
                  className="flex justify-between items-center mt-6"
                >
                  <div className="flex items-center">
                    <span className="font-bold text-white">
                      {formatLargeNumber(processBonesBalance(rewards.amount)) +
                        " HNT"}
                    </span>

                    <span className="text-sm mx-1">for</span>

                    <span className="text-md font-bold">
                      {rewards.type.split("_").map(capitalize).join(" ")}
                    </span>
                  </div>

                  <WalletLink walletAddress={rewards.account} />
                </div>
              ))}

              {loading.txnsRewards && (
                <div className="pt-5 pb-10 w-10 h-10 mx-auto">
                  <Image
                    src={Spinner}
                    alt="spinner"
                    className="animate-spin-linear"
                  />
                </div>
              )}
            </div>
          </Box>
        )}

        {currentTransactionDetails?.data_type === "subnetwork_rewards_v1" &&
          !isEmpty(currentTransactionDetails.rewards) && (
            <Box className="mt-8">
              <div>
                <div className="text-xl font-semibold border-b border-gray-200 pb-3">
                  Rewards
                </div>

                {currentTransactionDetails.rewards.map((rewards, key) => (
                  <div
                    key={key}
                    className="flex justify-between items-center mt-6"
                  >
                    <WalletLink walletAddress={rewards.account} />

                    <span>
                      {formatLargeNumber(processBonesBalance(rewards.amount)) +
                        " " +
                        upperCase(currentTransactionDetails.token_type)}
                    </span>
                  </div>
                ))}
              </div>
            </Box>
          )}

        {currentTransactionDetails?.data_type === "consensus_group_v1" && (
          <Box className="mt-8">
            <div>
              <div className="text-xl font-semibold border-b border-gray-200 pb-3">
                {`${currentTransactionDetails.members.length.toLocaleString()} Validators in consensus`}
              </div>

              {currentTransactionDetails.members.map((validatorUuid) => (
                <div key={validatorUuid} className="w-full mt-6">
                  <ValidatorLink validatorAddress={validatorUuid} />
                </div>
              ))}
            </div>
          </Box>
        )}

        {currentTransactionDetails?.data_type === "oui_v1" && (
          <Box className="mt-8">
            <div>
              <div className="text-xl font-semibold border-b border-gray-200 pb-3">
                {`${currentTransactionDetails.addresses.length.toLocaleString()} Address${
                  currentTransactionDetails.addresses.length === 1 ? "" : "es"
                }`}
              </div>

              {currentTransactionDetails.addresses.map((address) => (
                <div key={address} className="w-full mt-6">
                  <pre>{address}</pre>
                </div>
              ))}
            </div>
          </Box>
        )}

        {currentTransactionDetails?.data_type === "payment_v2" && (
          <Box className="mt-8">
            <div>
              <div className="text-xl font-semibold border-b border-gray-200 pb-3">
                {`${currentTransactionDetails.payments.length.toLocaleString()} Recipients`}
              </div>

              {currentTransactionDetails.payments.map((payment, key) => (
                <div
                  key={key}
                  className="flex justify-between items-center mt-6"
                >
                  <WalletLink walletAddress={payment.payee} />

                  {payment.memo !== DEFAULT_PAYMENT_MEMO && (
                    <div className="flex items-center">
                      <PencilAltIcon className="w-6 mr-2" />
                      <span>{Base64.decode(payment.memo)}</span>
                    </div>
                  )}

                  <span className="font-bold text-white">
                    {formatLargeNumber(processBonesBalance(payment.amount)) +
                      " HNT"}
                  </span>
                </div>
              ))}
            </div>
          </Box>
        )}

        {currentTransactionDetails?.data_type === "state_channel_close_v1" && (
          <Box className="mt-8">
            <div>
              <div className="text-xl font-semibold border-b border-gray-200 pb-3">
                {`${currentTransactionDetails.state_channel.summaries.length.toLocaleString()} Participating hotspot${
                  currentTransactionDetails.state_channel.summaries.length === 1
                    ? ""
                    : "s"
                }`}
              </div>

              {currentTransactionDetails.state_channel.summaries.map((data) => (
                <div
                  key={data.client}
                  className="flex justify-between items-center mt-6"
                >
                  <div>
                    <HotspotLink hotspotAddress={data.client} />
                    <WalletLink walletAddress={data.owner} />
                  </div>

                  <div>{data.num_dcs.toLocaleString()} DC</div>

                  <div className="flex flex-col items-end justify-center">
                    <div className="text-sm leading-tight tracking-tighter text-navy-400 font-medium">
                      <span className="pl-1.5">
                        {data.num_packets.toLocaleString()} packet
                        {data.num_packets === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="text-sm leading-tight tracking-tighter pt-1">
                      {formatBytes(data.num_dcs * 24)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Box>
        )}

        {currentTransactionDetails?.data_type === "vars_v1" &&
          !isEmpty(currentTransactionDetails.vars) && (
            <Box className="mt-8">
              <div>
                <div className="text-xl font-semibold border-b border-gray-200 pb-3">
                  {`${keys(
                    currentTransactionDetails.vars
                  ).length.toLocaleString()} Vars`}
                </div>

                {map(currentTransactionDetails.vars, (value, key) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-3 hover:underline"
                  >
                    <div>{key}</div>

                    <pre className="font-bold text-white">
                      {value.toString().length > 20 ? (
                        <ShortenedString string={value.toString()} />
                      ) : (
                        value.toString()
                      )}
                    </pre>
                  </div>
                ))}
              </div>
            </Box>
          )}
      </div>
    </div>
  );
};

export default TransactionDetails;

//
// Utils
//

export const DEFAULT_PAYMENT_MEMO = "AAAAAAAAAAA=";
