import { Logo } from "components/icons/logo";
import Link from "next/link";
import React from "react";

const FourOhFour: React.FC = () => {
  return (
    <div className="h-fit w-fit absolute -top-16 bottom-0 left-0 right-0 m-auto flex flex-col">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex justify-center">
          <span className="inline-flex">
            <span className="sr-only">Workflow</span>
            <Logo />
          </span>
        </div>
        <div className="pt-2">
          <div className="text-center">
            <h1 className="mt-2 text-4xl font-semibold text-white tracking-tight sm:text-5xl">
              Not Found
            </h1>
            <div className="mt-2">
              <Link href="/" passHref>
                <span className=" text-lg font-medium text-purple-400 cursor-pointer">
                  Go back to home
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FourOhFour;
