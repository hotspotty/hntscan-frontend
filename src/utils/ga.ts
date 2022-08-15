import GA4React from "ga-4-react";

let ga4react;

const init = async (gaCode: string | undefined) => {
  if (
    GA4React.isInitialized() ||
    !gaCode ||
    process.env.NODE_ENV === "development"
  )
    return;

  ga4react = new GA4React(gaCode);

  try {
    await ga4react.initialize();
  } catch (error) {
    console.error(error);
  }
};

export default init;
