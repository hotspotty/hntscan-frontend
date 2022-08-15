import { SearchIcon } from "@heroicons/react/solid";
import Dropdown from "components/dropdown";
import { Logo } from "components/icons/logo";
import { MenuIcon } from "components/icons/menu";
import Menu from "components/menu";
import SearchBar from "components/search/searchBar";
import { useExplorer } from "context/explorer";
import { head } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "utils/className";

const Header: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");
  const { searchItemByQuery, setSearchedItems } = useExplorer();
  const router = useRouter();
  const [showSearchBar, setShowSearchBar] = useState(false);

  const options: {
    title: string;
    links: { name: string; href: string }[];
  } = {
    title: "Blockchain",
    links: [
      {
        name: "Hotspots",
        href: "blockchain/hotspots"
      },
      {
        name: "Transactions",
        href: "blockchain/transactions"
      },
      {
        name: "Blocks",
        href: "blockchain/blocks"
      },
      {
        name: "Wallets",
        href: "blockchain/wallets"
      },
      {
        name: "Validators",
        href: "blockchain/validators"
      }
    ]
  };

  const openMenu = useCallback(() => {
    setShowMenu(true);
    document.body.classList.add("overflow-hidden");
  }, []);

  useEffect(() => {
    setSearch("");
    setSearchedItems(null);
  }, [router.asPath]); // eslint-disable-line react-hooks/exhaustive-deps

  const routerAbleToShowSearchBar = useMemo(
    () => (head(router.asPath.split("?")) as string) !== "/",
    [router.asPath]
  );

  return (
    <>
      <div className="flex w-full items-center justify-between max-w-[1480px] mx-auto px-4 pt-5 relative min-h-[64px]">
        <div
          className={classNames(
            showSearchBar && "mobile:opacity-0",
            "flex w-full mobile:flex-col mobile:items-start items-center transition-all duration-200 ease-in"
          )}
        >
          <Link href="/" passHref>
            <a className="cursor-pointer">
              <Logo />
            </a>
          </Link>

          <a
            className="group flex items-center h-full text-xs -mb-2 ml-2 mobile:ml-12"
            href="https://hotspotty.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="">Powered by</span>
            <span className="ml-1 text-sm group-hover:underline">
              Hotspotty
            </span>
          </a>
        </div>

        <div className="flex w-full justify-end items-center mobile:hidden">
          <Link href="/">
            <a className="text-sm font-medium hover:text-purple-400">Home</a>
          </Link>

          <Link href="/statistics">
            <a className="text-sm font-medium mx-8 hover:text-purple-400">
              Statistics
            </a>
          </Link>

          <div>
            <Dropdown
              open={openDropdown}
              setOpen={setOpenDropdown}
              items={options.links}
              title={options.title}
              dark={true}
              isLink={true}
            />
          </div>
        </div>

        {routerAbleToShowSearchBar && (
          <>
            <div
              className={classNames(
                showSearchBar ? "mobile:flex" : "mobile:hidden",
                "mobile:inset-x-0 mobile:absolute mobile:mx-auto mobile:w-[96%] lg:min-w-[320px] lg:max-w-[320px] lg:ml-4"
              )}
            >
              <SearchBar
                placeholder="Txn, block, hotspot, validator, wallet"
                search={search}
                setSearch={setSearch}
                withArrowBack={showSearchBar}
                onSearch={(query) =>
                  searchItemByQuery(query.replaceAll(" ", "_"))
                }
                onBlur={() => setShowSearchBar(false)}
                onBack={() => setShowSearchBar(false)}
              />
            </div>

            <button
              className="lg:hidden"
              onClick={() => setShowSearchBar(true)}
            >
              <SearchIcon className="w-6 text-white mr-8" />
            </button>
          </>
        )}

        <button className="lg:hidden" onClick={() => openMenu()}>
          <MenuIcon />
        </button>
      </div>

      <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
    </>
  );
};

export default Header;
