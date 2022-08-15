import animalHash from "angry-purple-tiger";
import Link from "next/link";
import React from "react";
import classNames from "utils/className";

interface Props {
  className?: string;
  validatorAddress: string | undefined;
  online?: string | undefined;
}

const ValidatorLink: React.FC<Props> = ({
  className,
  validatorAddress,
  online
}) =>
  validatorAddress ? (
    <Link href={`/blockchain/validators/${validatorAddress}`} passHref>
      <div
        className={classNames("flex items-center hover:underline", className)}
      >
        {online && (
          <span
            className={classNames(
              "w-3 h-3 flex-shrink-0 rounded-full mr-1.5",
              online === "online" ? "bg-green-300" : "bg-red-300"
            )}
          />
        )}
        <span className="text-purple-300 font-medium cursor-pointer">
          {animalHash(validatorAddress)}
        </span>
      </div>
    </Link>
  ) : (
    <div className={classNames("py-1", className)}>
      <div className="w-48 rounded h-4 animate-pulse bg-gray-300 flex" />
    </div>
  );

export default ValidatorLink;
