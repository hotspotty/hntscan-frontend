import Box from "components/box";
import Breadcrumbs from "components/breadcrumbs";
import { Cash } from "components/icons/cash";
import { ChevRight } from "components/icons/chevronRight";
import { Clock } from "components/icons/clock";
import { Duplicate } from "components/icons/duplicate";
import LineTabs from "components/lineTabs";
import { useBlocks } from "context/blocks/index";
import { countBy, map } from "lodash";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import copyToClipboard from "utils/copyToClipboard";
import { formatTransactionType } from "utils/formatTransactionType";
import truncateText from "utils/truncateText";
import { BlockTransaction } from "utils/types/blocks";

const BlockDetails: React.FC = () => {
  const { fetchBlockByHeight, currentBlock } = useBlocks();
  const [filteredTransactionType, setFilteredTransactionType] = useState("all");
  const router = useRouter();

  const blockTransactionTypeCounts = useMemo(
    () => countBy(currentBlock?.block_transactions || [], "type"),
    [currentBlock?.block_transactions]
  );

  const overViewTabs = useMemo(
    () => [
      {
        key: "all",
        title: "All",
        count: (currentBlock?.block_transactions || []).length
      },
      ...map(blockTransactionTypeCounts, (count, key) => ({
        key,
        title: formatTransactionType(key),
        count
      }))
    ],
    [blockTransactionTypeCounts, currentBlock?.block_transactions]
  );

  useEffect(() => {
    if (typeof router.query.id !== "string") return;

    fetchBlockByHeight(router.query.id);
  }, [fetchBlockByHeight, router.query.id]);

  const transactionsFiltered = useMemo(
    () =>
      currentBlock?.block_transactions?.filter(
        (transaction) =>
          filteredTransactionType === "all" ||
          transaction.type === filteredTransactionType
      ),
    [currentBlock?.block_transactions, filteredTransactionType]
  );

  return (
    <div className="w-full mobile:w-11/12 mt-0 pb-32">
      <Head>
        <title>HNTScan - Block {router.query.id}</title>
      </Head>

      <div className="w-full mt-24 mobile:hidden">
        <Breadcrumbs />
      </div>

      <div className="mobile:mt-8 mt-20">
        <h3 className="mobile:text-2xl text-4xl font-bold">
          Block #{router.query.id}
        </h3>

        <div className="mt-2 flex items-center mobile:flex-col mobile:items-start">
          <span className="text-sm font-bold flex items-center mr-5">
            <Clock />
            <span className="ml-1 mobile:text-xs">
              {moment
                .unix(currentBlock?.time || 0)
                .format("DD MMM YYYY, hh:mm a")}
            </span>
          </span>
          <span className="text-sm font-bold flex items-center mr-5 mobile:mt-4">
            <Cash />
            <span className="ml-2 mobile:text-xs">
              {currentBlock?.transaction_count} transactions
            </span>
          </span>
        </div>
        <div className="relative mobile:mx-auto">
          <Box className="ease-in-out duration-500 mt-10 px-4 pb-6">
            <div className="w-full">
              <p className="text-xl font-semibold lg:mb-2">Transactions</p>
              <LineTabs
                sectionName="transactions"
                items={overViewTabs}
                current={filteredTransactionType}
                setCurrent={(current) => setFilteredTransactionType(current)}
              />

              <div className="w-full">
                {transactionsFiltered?.map((item: BlockTransaction, index) => (
                  <div
                    className="flex justify-between items-center border-b border-gray-200 last:border-b-0"
                    key={index}
                  >
                    <div className="w-full mt-5 pb-5">
                      <span className="text-gray-300 mt-4 font-medium text-sm">
                        {formatTransactionType(item?.type)}
                      </span>

                      <div className="flex items-center justify-between mt-2 text-sm mobile:w-full">
                        <span className="flex items-center font-bold cursor-pointer w-full">
                          <Link
                            href={`/blockchain/transactions/${item.hash}`}
                            passHref
                          >
                            <h4
                              className="text-purple-300 font-medium mr-1 cursor-pointer hover:underline mobile:w-6/12 mobile:truncate"
                              title={item?.hash as string}
                            >
                              <pre>
                                {truncateText(item?.hash as string, 20)}
                              </pre>
                            </h4>
                          </Link>
                          <button onClick={() => copyToClipboard(item.hash)}>
                            <Duplicate className="ml-2 w-4 h-4 -mt-1" />
                          </button>
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/blockchain/transactions/${item.hash}`}
                      passHref
                    >
                      <span>
                        <ChevRight className="cursor-pointer" />
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default BlockDetails;
