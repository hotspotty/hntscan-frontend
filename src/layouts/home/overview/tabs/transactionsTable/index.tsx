import BlockLink from "components/blockLink";
import { Duplicate } from "components/icons/duplicate";
import Table from "components/table";
import moment from "moment";
import Link from "next/link";
import React, { useCallback, useMemo, useRef } from "react";
import copyToClipboard from "utils/copyToClipboard";
import { formatTransactionType } from "utils/formatTransactionType";
import truncateText from "utils/truncateText";
import useMount from "utils/useMount";
import { useTransactions } from "../../../../../context/transactions/index";

const TransactionsTable: React.FC = () => {
  const { transactions, fetchTransactions, loading } = useTransactions();
  const currentPage = useRef(0);

  useMount(() => {
    fetchTransactions(currentPage.current);
    currentPage.current++;

    window.addEventListener("scroll", loadMore);

    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  });

  const loadMore = useCallback(() => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      fetchTransactions(currentPage.current);
      currentPage.current++;
    }
  }, [fetchTransactions]);

  const data = useMemo(
    () =>
      transactions?.map((transaction) => ({
        id: (
          <div className="flex items-center">
            <Link
              href={`/blockchain/transactions/${transaction.hash}`}
              passHref
            >
              <span className="text-purple-300 font-medium mr-1 cursor-pointer hover:underline">
                <pre>{truncateText(transaction.hash, 20)}</pre>
              </span>
            </Link>
            <button onClick={() => copyToClipboard(transaction.hash)}>
              <Duplicate width={18} />
            </button>
          </div>
        ),
        timestamp: moment
          .unix(transaction?.time || 0)
          .utc()
          .fromNow(),
        type: formatTransactionType(transaction?.type),
        block: <BlockLink blockHeight={transaction.height} />
      })),
    [transactions]
  );

  return <Table head={header} data={data} loading={loading.transactions} />;
};

export default TransactionsTable;

//
// Utils
//

const header = [
  {
    key: "id",
    hiddenTitle: false,
    title: "Tx Hash"
  },
  {
    key: "timestamp",
    hiddenTitle: false,
    title: "timestamp"
  },
  {
    key: "type",
    hiddenTitle: false,
    title: "type"
  },
  {
    key: "block",
    hiddenTitle: false,
    title: "Block"
  }
];
