import MobileSelect from "components/mobileSelect";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import classNames from "utils/className";

interface Props {
  sectionName: string;
  items: string[];
  current: string;
  setCurrent: (item: string) => void;
}

const Tabs: React.FC<Props> = ({ items, current, setCurrent, sectionName }) => {
  const router = useRouter();

  useEffect(() => {
    const item = router.query[sectionName];

    if (!item || typeof item !== "string") return;

    setCurrent(item);
  }, [router, sectionName, setCurrent]);

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
      <MobileSelect options={items} setCurrent={(item) => handleChange(item)} />

      <div className="flex mobile:hidden">
        {items.map((item, index) => (
          <button
            onClick={() => handleChange(item)}
            className={classNames(
              "text-xs font-medium px-3 py-2 flex items-center justify-center transition-all rounded-md mr-6 hover:bg-purple-50 hover:text-gray-700",
              item === current
                ? "bg-purple-50 text-gray-700"
                : "bg-transparent text-purple-50"
            )}
            key={index}
          >
            {item}
          </button>
        ))}
      </div>
    </>
  );
};

export default Tabs;
