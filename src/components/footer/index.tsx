import { HotspottyLogo } from "components/icons/hotspottyLogo";
import { useRouter } from "next/router";
import classNames from "utils/className";

const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <div
      className={classNames(
        "mobile:flex-col lg:flex justify-center items-center lg:justify-center w-full max-w-[1330px] mx-auto px-2 absolute bottom-0 right-0 left-0 mb-8 global-footer",
        router.pathname === "/" ? "mobile:hidden" : "mobile:flex"
      )}
    >
      <a
        className="flex items-center group"
        href="https://hotspotty.net"
        target="_blank"
        rel="noopener noreferrer"
      >
        <HotspottyLogo width={32} height={32} />
        <span className="font-medium text-sm ml-3">Powered by</span>
        <span className="group-hover:underline font-medium text-sm ml-1">
          Hotspotty
        </span>
      </a>
    </div>
  );
};

export default Footer;
