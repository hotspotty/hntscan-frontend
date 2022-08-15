import Blur from "components/blur";
import { ArrowDown } from "components/icons/arrowDown";
import Search from "components/search";
import { useExplorer } from "context/explorer/index";
import Overview from "layouts/home/overview";
import Statistics from "layouts/home/statistics";
import Head from "next/head";
import { useCallback, useState } from "react";
import classNames from "utils/className";
import useMount from "utils/useMount";

const Home: React.FC = () => {
  const { searchItemByQuery, setSearchedItems } = useExplorer();
  const [search, setSearch] = useState("");
  const [showStatics, setShowStatics] = useState(false);

  const hiddenFooter = useCallback(() => {
    const footer = document.querySelector(".global-footer");

    if (!footer) return;

    footer.classList.remove("mobile:hidden");
    footer.classList.add("mobile:flex");
  }, []);

  useMount(() => {
    window.addEventListener("wheel", () => {
      setShowStatics(true);
    });

    window.addEventListener("touchmove", () => {
      setShowStatics(true);
      hiddenFooter();
    });

    return () => {
      window.removeEventListener("wheel", () => {});
      window.removeEventListener("touchmove", () => {});
      setSearchedItems(null);
    };
  });

  return (
    <div className="flex w-full h-full flex-col items-center justify-center mt-48 mb-36">
      <Head>
        <title>HNTScan</title>
      </Head>

      <h1 className="text-lg font-extralight mb-0.5">Explore the</h1>
      <h2 className="text-3xl font-bold mb-5">Helium Blockchain</h2>

      <div className="flex justify-center w-full mobile:w-11/12">
        <Search
          search={search}
          setSearch={setSearch}
          onSearch={(query) => searchItemByQuery(query.replaceAll(" ", "_"))}
          onSearchButtonClick={() =>
            searchItemByQuery(search.replaceAll(" ", "_"))
          }
        />
      </div>

      {!showStatics && (
        <div className="flex flex-col justify-center items-center fixed mobile:bottom-6 bottom-0 lg:mb-44">
          <button
            onClick={() => {
              setShowStatics(true);
              hiddenFooter();
            }}
            className="animate-bounce flex items-center justify-center w-16 h-16 border border-white rounded-full relative overflow-hidden mt-8"
          >
            <Blur />
            <ArrowDown className="opacity-70 w-5 relative" />
          </button>
        </div>
      )}

      <div
        className={classNames(
          "ease-in-out duration-500 mt-8 w-full mobile:w-11/12",
          showStatics
            ? "relative translate-y-0"
            : "pointer-events-none bottom-[-400px] fixed translate-y-full"
        )}
      >
        <Statistics />

        <div className="mt-8">
          <Overview />
        </div>
      </div>
    </div>
  );
};

export default Home;
