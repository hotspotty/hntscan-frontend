import React from "react";
import classNames from "utils/className";

interface Props {
  className?: string;
}

const Blur: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={classNames(
        "bg-white opacity-20 absolute w-full h-full left-0 top-0 backdrop-blur-md z-0",
        className
      )}
    ></div>
  );
};

export default Blur;
