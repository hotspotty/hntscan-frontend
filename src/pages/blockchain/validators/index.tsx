import Box from "components/box";
import Breadcrumbs from "components/breadcrumbs";
import ValidatorsTable from "layouts/home/overview/tabs/validatorsTable";
import Head from "next/head";
import React from "react";

const Blocks: React.FC = () => {
  return (
    <div className="w-full mobile:w-11/12 mt-0 pb-36 mobile:pb-32">
      <Head>
        <title>HNTScan - Validators</title>
      </Head>

      <div className="w-full mt-24 mobile:hidden">
        <Breadcrumbs />
      </div>
      <div className="w-full flex items-center mt-14">
        <h4 className="mobile:text-2xl text-4xl font-bold">Validators</h4>
      </div>
      <div className="lmobile:mt-10 mt-14 relative">
        <Box>
          <ValidatorsTable />
        </Box>
      </div>
    </div>
  );
};

export default Blocks;
