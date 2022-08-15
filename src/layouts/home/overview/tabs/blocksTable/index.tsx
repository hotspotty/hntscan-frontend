import BlockLink from "components/blockLink";
import Table from "components/table";
import { useBlocks } from "context/blocks";
import { orderBy } from "lodash";
import moment from "moment";
import React, { useCallback, useMemo, useRef } from "react";
import useMount from "utils/useMount";

const BlocksTable: React.FC = () => {
  const { blocks, fetchBlocks, loading } = useBlocks();
  const currentPage = useRef(0);

  useMount(() => {
    fetchBlocks(currentPage.current);
    currentPage.current++;

    window.addEventListener("scroll", loadMore);

    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  });

  const loadMore = useCallback(() => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      fetchBlocks(currentPage.current);
      currentPage.current++;
    }
  }, [fetchBlocks]);

  const data = useMemo(
    () =>
      orderBy(blocks, "height", "desc").map((block) => ({
        id: <BlockLink blockHeight={block.height} />,
        timestamp: moment
          .unix(block?.time || 0)
          .utc()
          .fromNow(),
        transactions: block.transaction_count
      })),
    [blocks]
  );

  return <Table head={header} data={data} loading={loading.blocks} />;
};

export default BlocksTable;

//
// Utils
//

const header = [
  {
    key: "id",
    hiddenTitle: false,
    title: "Block ID"
  },
  {
    key: "timestamp",
    hiddenTitle: false,
    title: "Timestamp"
  },
  {
    key: "transactions",
    hiddenTitle: false,
    title: "Transactions"
  }
];
