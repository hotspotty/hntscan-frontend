import MobileSelect from "components/mobileSelect";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import classNames from "utils/className";

interface Props {
  sectionName: string;
  items: LineTabItem[];
  current: string;
  setCurrent: (item: string) => void;
  className?: string;
}

const LineTabs: React.FC<Props> = ({
  items,
  current,
  setCurrent,
  className,
  sectionName
}) => {
  const router = useRouter();

  useEffect(() => {
    const item = router.query[sectionName];

    if (!item || typeof item !== "string") return;

    setCurrent(item);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, sectionName]);

  const handleChange = useCallback(
    (value: string) => {
      router.push(
        { query: { ...router.query, [sectionName]: value } },
        undefined,
        { scroll: false }
      );
    },
    [router, sectionName]
  );

  return (
    <>
      <div className="mt-1 lg:hidden">
        <MobileSelect
          options={items}
          setCurrent={(item) => handleChange(item)}
        />
      </div>

      <div className="border-b border-gray-200 relative mobile:hidden">
        <div className="w-full flex -mb-[1px] overflow-x-auto">
          {items.map((item) => (
            <button
              onClick={() => handleChange(item.key)}
              className={classNames(
                "text-xs text-purple-50 font-medium px-3 relative transition-all pt-2 pb-[11px] flex items-center justify-center border-b-2 mr-6 hover:border-b-2 hover:border-purple-400",
                className,
                item.key === current
                  ? "border-purple-500"
                  : "border-transparent"
              )}
              key={item.key}
            >
              {item.title}
              <div className="h-6">
                {item.count !== 0 && (
                  <div className="font-bold px-2 py-[2px] ml-4 flex items-center justify-center rounded-md bg-purple-500">
                    {item.count}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default LineTabs;

//
// Utils
//

export interface LineTabItem {
  key: string;
  title: string;
  count: number;
}
