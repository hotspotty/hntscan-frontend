import { InformationIcon } from "components/icons/informations";
import React, { useState } from "react";
import classNames from "utils/className";

interface Props {
  title: string;
  tooltipMessage: string;
  className?: string;
}

const Tooltip: React.FC<Props> = ({ title, tooltipMessage, className }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="w-full flex items-center relative z-20">
      <h4
        className={classNames(
          `${className || "mobile:text-lg text-2xl font-bold"} mr-2`
        )}
      >
        {title}
      </h4>
      <button
        className="w-6 h-6"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <InformationIcon
          className={classNames(
            showTooltip ? "stroke-purple-300" : "stroke-white",
            className ? "w-5" : ""
          )}
        />
      </button>
      {showTooltip && tooltipMessage && (
        <div
          className={classNames(
            className ? "left-0 top-8" : "left-28 top-10",
            "bg-white rounded-md absolute max-w-[200px] p-2"
          )}
        >
          <span className="text-xs font-normal text-gray-700">{tooltipMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
