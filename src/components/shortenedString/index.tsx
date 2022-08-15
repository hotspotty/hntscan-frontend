import { Duplicate } from "components/icons/duplicate";
import React from "react";
import classNames from "utils/className";
import copyToClipboard from "utils/copyToClipboard";
import truncateText from "utils/truncateText";

interface Props {
  className?: string;
  string: string | undefined;
}

const ShortenedString: React.FC<Props> = ({ className, string }) =>
  string ? (
    <div className={classNames("flex items-center text-sm", className)}>
      <span
        className="truncate mr-2 mobile:text-xs mobile:w-5/12"
        title={string}
      >
        <pre>{truncateText(string, 20)}</pre>
      </span>
      <button onClick={() => copyToClipboard(string)}>
        <Duplicate className="flex-shrink-0" width={18} />
      </button>
    </div>
  ) : (
    <div className={classNames("py-1", className)}>
      <div className="w-48 rounded h-4 animate-pulse bg-gray-300 flex" />
    </div>
  );

export default ShortenedString;
