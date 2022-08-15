import Image from "next/image";
import Spinner from "../../../public/images/spinner.png";

const Loading: React.FC = () => {
  return (
    <div className="fixed h-screen w-screen top-0 left-0 right-0 bottom-0 m-auto bg-black opacity-[0.64] flex items-center justify-center z-10">
      <div className="w-[150px] flex flex-col items-center">
        <Image src={Spinner} alt="spinner" className="animate-spin-linear" />
        <span className="mt-4">LOADING</span>
      </div>
    </div>
  );
};

export default Loading;
