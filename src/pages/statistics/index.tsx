import Box from "components/box";
import Breadcrumbs from "components/breadcrumbs";
import Tooltip from "components/tooltip";
import Hotspots from "layouts/home/statistics/hotspots";
import Market from "layouts/home/statistics/market";
import Overview from "layouts/home/statistics/overview";
import Validators from "layouts/home/statistics/validators";
import Head from "next/head";
import React from "react";

const Statistics: React.FC = () => {
  return (
    <div className="w-full sm:w-11/12 lg:w-full mt-0 pb-36 sm:pb-32 px-4 lg:px-0">
      <Head>
        <title>HNTScan - Statistics</title>
      </Head>

      <div className="w-full mt-24 mobile:hidden">
        <Breadcrumbs />
      </div>
      <div className="w-full flex items-center mt-14">
        <div className="w-full">
          <h4 className="mobile:text-2xl text-3xl font-bold">
            Helium Network Statistics
          </h4>
        </div>
      </div>
      <div className="mt-14 mobile:mt-8 relative">
        <Tooltip title={"Statistics"} tooltipMessage={""} />
        <Box className="p-5 pt-8 mt-4">
          <Overview />
        </Box>
      </div>
      <div className="mt-14">
        <Tooltip title={"Hotspots"} tooltipMessage={""} />

        <Box className="p-5 pt-8 mt-4">
          <Hotspots />
        </Box>
      </div>
      <div className="mt-14">
        <Tooltip title={"Market"} tooltipMessage={""} />
        <Box className="p-5 pt-8 mt-4">
          <Market />
        </Box>
      </div>
      <div className="mt-14">
        <Tooltip title={"Validators"} tooltipMessage={""} />
        <Box className="p-5 pt-8 mt-4">
          <Validators />
        </Box>
      </div>
    </div>
  );
};

export default Statistics;
