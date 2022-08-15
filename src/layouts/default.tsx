import Footer from "components/footer";
import Header from "components/header";
import { NextComponentType } from "next";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: NextComponentType<{}, {}, Props> = ({ children }) => {
  return (
    <>
      <Image
        src="/images/background.svg"
        className="fixed object-cover w-screen h-screen"
        layout="raw"
        width="100%"
        height="100%"
        alt="background"
      />

      <div className="relative z-10 w-full min-h-screen">
        <Header />
        <div className="flex w-full justify-center h-full items-center max-w-[1330px] mx-auto lg:px-2">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DefaultLayout;
