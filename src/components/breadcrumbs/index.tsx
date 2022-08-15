import { Duplicate } from "components/icons/duplicate";
import { compact, head } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import copyToClipboard from "utils/copyToClipboard";
import truncateText from "utils/truncateText";

const Breadcrumbs: React.FC = () => {
  const router = useRouter();

  const breadcrumbs = useMemo(() => {
    const pathname = head(router.asPath.split("?")) as string;

    return compact(pathname.split("/"));
  }, [router.asPath]);

  const pathName = useCallback(
    (position: number) => {
      const path = breadcrumbs
        .filter((_, index) => index < position)
        .map((name) => "/" + name)
        .join("");

      if (path === "/blockchain") {
        return "/";
      }

      return path;
    },
    [breadcrumbs]
  );

  return (
    <span className="flex items-center mobile:hidden">
      {breadcrumbs.map((breadcrumb, index) => {
        if (breadcrumbs.length - 1 === index) {
          if (breadcrumb.length > 20) {
            return (
              <span
                key={breadcrumb}
                className="text-sm font-semibold flex items-center gap-2"
              >
                <pre title={breadcrumb}>{truncateText(breadcrumb, 20)}</pre>
                <button onClick={() => copyToClipboard(breadcrumb)}>
                  <Duplicate className="flex-shrink-0" width={18} />
                </button>
              </span>
            );
          }

          return (
            <span key={breadcrumb} className="capitalize font-semibold text-sm">
              {breadcrumb}
            </span>
          );
        }

        return (
          <Link href={`${pathName(index + 1)}`} key={index} passHref>
            <span className="flex items-center">
              <span className="capitalize cursor-pointer font-semibold text-sm hover:text-purple-400">
                {breadcrumb}
              </span>
              <span className="mx-3">/</span>
            </span>
          </Link>
        );
      })}
    </span>
  );
};

export default Breadcrumbs;
