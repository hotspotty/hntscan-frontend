import Loading from "components/loading";
import React, { useContext, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";

interface Props {
  children: JSX.Element;
}

export type ContextValue = {
  setShowGlobalLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppearenceContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const AppearenceProvider: React.FC<Props> = ({ children, ...rest }) => {
  const [showGlobalLoading, setShowGlobalLoading] = useState<boolean>(false);

  const value = useMemo(
    () => ({ setShowGlobalLoading }),
    [setShowGlobalLoading]
  );

  return (
    <AppearenceContext.Provider value={value} {...rest}>
      {children}

      <Toaster
        containerStyle={{ fontSize: 14, zIndex: 999999999 }}
        position="top-center"
        reverseOrder={false}
      />

      {showGlobalLoading && <Loading />}
    </AppearenceContext.Provider>
  );
};

export const useAppearence = (): ContextValue => {
  const context = useContext(AppearenceContext);

  if (context === undefined) {
    throw new Error("useAppearence must be used within an AppearenceProvider");
  }

  return context;
};
