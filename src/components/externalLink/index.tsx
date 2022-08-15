import { ExternalLinkIcon } from "@heroicons/react/solid";
import React from "react";
import classNames from "utils/className";

interface Props {
  className?: string;
  iconStyle?: React.CSSProperties;
  text: string;
  url: string;
  iconComponent?: React.ComponentType<any>;
}

const ExternalLink: React.FC<Props> = ({
  className,
  iconStyle = {},
  text,
  url,
  iconComponent: Icon = ExternalLinkIcon
}) => (
  <a
    className={classNames(
      "flex items-center truncate font-semibold text-purple-300 hover:underline",
      className
    )}
    href={url}
    target="_blank"
    rel="noreferrer"
  >
    {text}
    <Icon className={"h-3 w-3 inline ml-1 flex-shrink-0"} style={iconStyle} />
  </a>
);

export default ExternalLink;
