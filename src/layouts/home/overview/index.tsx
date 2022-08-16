import Box from "components/box";
import Tabs from "components/tabs";
import React, { useMemo, useState } from "react";
import BlocksTable from "./tabs/blocksTable";
import HotspotsTable from "./tabs/hotspotsTable";
import TransactionsTable from "./tabs/transactionsTable";
import ValidatorsTable from "./tabs/validatorsTable";
import WalletsTable from "./tabs/walletsTable";

const Overview: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("Hotspots");

  const renderContent = useMemo(() => {
    switch (currentTab) {
      case "Blocks":
        return <BlocksTable />;
      case "Transactions":
        return <TransactionsTable />;
      case "Hotspots":
        return <HotspotsTable />;
      case "Wallets":
        return <WalletsTable />;
      case "Validators":
        return <ValidatorsTable />;
      default:
        return null;
    }
  }, [currentTab]);

  return (
    <Box>
      <div className="w-full">
        <div className="mb-3 flex justify-between items-center">
          <p className="text-xl font-semibold">Recent Activity</p>
        </div>

        <Tabs
          sectionName="list"
          items={tabs}
          current={currentTab}
          setCurrent={setCurrentTab}
        />

        <div className="mt-6">{renderContent}</div>
      </div>
    </Box>
  );
};

export default Overview;

//
// Utils
//

const tabs = ["Hotspots", "Blocks", "Transactions", "Wallets", "Validators"];
