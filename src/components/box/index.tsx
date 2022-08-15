import Blur from "components/blur";
import React from "react";
import classNames from "utils/className";

interface Props {
  children: JSX.Element;
  className?: string;
}

const Box: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "w-full h-full flex p-4 overflow-hidden rounded-xl border border-white border-opacity-70 relative",
        className
      )}
    >
      <Blur className="rounded-xl" />
      <div className="w-full z-10 h-fit">{children}</div>
    </div>
  );
};

export default Box;
