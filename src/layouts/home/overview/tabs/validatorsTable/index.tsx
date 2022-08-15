import BlockLink from "components/blockLink";
import Table from "components/table";
import ValidatorLink from "components/validatorLink";
import { useValidators } from "context/validators";
import React, { useCallback, useMemo, useRef } from "react";
import formatVersion from "utils/formatVersion";
import useMount from "utils/useMount";

const ValidatorsTable: React.FC = () => {
  const { validators, fetchValidators, loading } = useValidators();
  const currentPage = useRef(0);

  useMount(() => {
    fetchValidators(currentPage.current);
    currentPage.current++;

    window.addEventListener("scroll", loadMore);

    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  });

  const loadMore = useCallback(() => {
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      fetchValidators(currentPage.current);
      currentPage.current++;
    }
  }, [fetchValidators]);

  const data = useMemo(
    () =>
      validators.map((validator) => ({
        id: (
          <ValidatorLink
            validatorAddress={validator.address}
            online={validator.online}
          />
        ),
        penalty_score: validator.penalty_score.toFixed(3),
        staking_status: <span className="capitalize">{validator.staked}</span>,
        last_heartbeat: <BlockLink blockHeight={validator.last_heartbeat} />,
        version: formatVersion(validator.version_heartbeat)
      })),
    [validators]
  );

  return <Table head={header} data={data} loading={loading.validators} />;
};

export default ValidatorsTable;

//
// Utils
//

const header = [
  {
    key: "id",
    hiddenTitle: false,
    title: "Validator"
  },
  {
    key: "staking_status",
    hiddenTitle: false,
    title: "Staking status"
  },
  {
    key: "penalty_score",
    hiddenTitle: false,
    title: "Penalty score"
  },
  {
    key: "last_heartbeat",
    hiddenTitle: false,
    title: "Last heartbeat block"
  },
  {
    key: "version",
    hiddenTitle: false,
    title: "Version"
  }
];
