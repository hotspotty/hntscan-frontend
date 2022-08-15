import { hotjar } from "react-hotjar";

const init = (hjidCode: string | undefined, hjsvCode: string | undefined) => {
  if (!hjidCode || !hjsvCode || process.env.NODE_ENV === "development") return;

  try {
    hotjar.initialize(Number(hjidCode), Number(hjsvCode));
  } catch (error) {
    console.error(error);
  }
};

export default init;
