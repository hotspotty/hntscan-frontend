import Box from "components/box";
import { ArrowRight } from "components/icons/arrowRight";
import Tabs from "components/tabs";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Hotspots from "./hotspots";
import Market from "./market";
import Overview from "./overview";
import Validators from "./validators";

const Statistics: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("Overview");

  const renderContentTab = useMemo(() => {
    switch (currentTab) {
      case "Overview":
        return <Overview />;
      case "Market":
        return <Market />;
      case "Validators":
        return <Validators />;
      case "Hotspots":
        return <Hotspots />;
      default:
        return null;
    }
  }, [currentTab]);

  return (
    <Box>
      <div className="w-full">
        <div className="mb-3 flex justify-between items-center">
          <p className="text-xl font-semibold">Statistics</p>
          <Link href="/statistics" passHref>
            <span className="flex items-center font-normal text-sm cursor-pointer">
              See more
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
        </div>

        <Tabs
          sectionName="statistics"
          items={tabs}
          current={currentTab}
          setCurrent={setCurrentTab}
        />

        <div className="mt-6">{renderContentTab}</div>
      </div>
    </Box>
  );
};

export default Statistics;

//
// Utils
//

const tabs = ["Overview", "Market", "Validators", "Hotspots"];
