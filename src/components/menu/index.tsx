import { ChevronDownIcon } from "@heroicons/react/solid";
import { Analytics } from "components/icons/analytics";
import { CloseIcon } from "components/icons/close";
import { Cube } from "components/icons/cube";
import { Home } from "components/icons/home";
import { Logo } from "components/icons/logo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from "react";
import classNames from "utils/className";

interface Props {
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
}

const Menu: React.FC<Props> = ({ showMenu, setShowMenu }) => {
  const router = useRouter();
  const [openLinks, setOpenLinks] = useState(false);

  const navigation = useMemo(
    () => [
      {
        icon: <Home color={router.pathname === "/" ? "#4B5563" : "#D1D5DB"} />,
        name: "Home",
        route: "/"
      },
      {
        icon: (
          <Analytics
            color={router.pathname === "/statistics" ? "#4B5563" : "#D1D5DB"}
          />
        ),
        name: "Statistics",
        route: "/statistics"
      }
    ],
    [router.pathname]
  );

  const navigationBlockchain = useMemo(
    () => [
      {
        name: "Blocks",
        route: "/blockchain/blocks"
      },
      {
        name: "Transactions",
        route: "/blockchain/transactions"
      },
      {
        name: "Wallets",
        route: "/blockchain/wallets"
      },
      {
        name: "Hotspots",
        route: "/blockchain/hotspots"
      },
      {
        name: "Validators",
        route: "/blockchain/validators"
      }
    ],
    []
  );

  const closeMenu = useCallback(() => {
    document.body.classList.remove("overflow-hidden");
    setShowMenu(false);
  }, [setShowMenu]);

  return (
    <>
      {showMenu && (
        <div
          onClick={closeMenu}
          className="fixed left-0 top-0 bg-black w-full h-full z-30 opacity-80"
        ></div>
      )}

      <div
        className={classNames(
          "fixed w-9/12 h-full px-6 top-0 right-0 backdrop-blur bg-white bg-opacity-20 z-30 ease-in duration-200",
          showMenu ? "translate-x-[0%]" : "translate-x-[100%]"
        )}
      >
        <div onClick={closeMenu} className="pt-14 ml-2">
          <CloseIcon />
        </div>
        <div className="mt-12">
          <div className="flex">
            <Logo />
          </div>
          <ul>
            {navigation.map((item, index) => (
              <li
                key={index}
                onClick={() => closeMenu()}
                className={classNames(
                  router.pathname === item.route
                    ? "bg-gray-100 text-gray-900"
                    : "",
                  "flex items-center w-full h-11 first:mt-12 mt-8 pl-2.5 rounded-md"
                )}
              >
                <span className="w-6 mr-2">{item.icon}</span>
                <Link href={`${item.route}`}>{item.name}</Link>
              </li>
            ))}

            <li
              className={classNames(
                "mt-10 ease-in duration-200 overflow-hidden",
                openLinks ? "max-h-[500px]" : "max-h-[44px]"
              )}
            >
              <div
                onClick={() => setOpenLinks(!openLinks)}
                className="flex justify-between pl-2.5"
              >
                <div className="flex items-center">
                  <span className="w-6 mr-2">
                    <Cube />
                  </span>

                  <h4>Blockchain</h4>
                </div>
                <ChevronDownIcon
                  width={30}
                  className={classNames(openLinks ? "rotate-180" : "")}
                />
              </div>
              <div className="pt-8">
                {navigationBlockchain.map(({ name, route }) => (
                  <div
                    onClick={closeMenu}
                    key={name}
                    className={classNames(
                      router.pathname === route
                        ? "bg-gray-100 text-gray-900"
                        : "",
                      "w-full h-11 pl-9 rounded-md flex items-center"
                    )}
                  >
                    <Link href={route}>{name}</Link>
                  </div>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Menu;
