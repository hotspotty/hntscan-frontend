import Box from "components/box";
import Breadcrumbs from "components/breadcrumbs";
import HotspotsTable from "layouts/home/overview/tabs/hotspotsTable";
import Head from "next/head";
import React from "react";

const Hotspots: React.FC = () => {
  return (
    <div className="w-full mobile:w-11/12 mt-0 pb-32">
      <Head>
        <title>HNTScan - Hotspots</title>
      </Head>

      <div className="w-full mt-24 mobile:hidden">
        <Breadcrumbs />
      </div>

      <div className="w-full flex items-center mt-14">
        <h4 className="mobile:text-2xl text-4xl font-bold">Hotspots</h4>
      </div>
      <div className="mobile:mt-10 mt-14 relative">
        <Box>
          <HotspotsTable />
        </Box>
      </div>
    </div>
  );
};

export default Hotspots;
