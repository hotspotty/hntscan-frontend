import { useAppearence } from "context/appearence";
import React, { useCallback, useContext, useMemo, useState } from "react";
import api from "utils/apiService";
import { Validator } from "utils/types/validators";

interface Props {
  children: JSX.Element;
}

export type ContextValue = {
  validators: Validator[];
  currentValidator: Validator | null;
  fetchValidators: (page: number) => Promise<void>;
  fetchValidatorByUuid: (validatorUuid: string) => Promise<void>;
  setCurrentValidator: React.Dispatch<React.SetStateAction<Validator | null>>;
  loading: Loading;
  fetchValidatorRewards: (validator: string, days: string) => Promise<void>;
  currentValidatorRewards: { [key: string]: number };
};

export const ValidatorsContext = React.createContext<ContextValue | undefined>(
  undefined
);

export const ValidatorsProvider: React.FC<Props> = (props) => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [currentValidator, setCurrentValidator] = useState<Validator | null>(
    null
  );
  const [currentValidatorRewards, setCurrentValidatorRewards] = useState<{
    [key: string]: number;
  }>({});
  const [loading, setLoading] = useState<Loading>({
    validators: false,
    moreValidators: false
  });
  const { setShowGlobalLoading } = useAppearence();

  const fetchValidators = useCallback(
    async (page: number) => {
      if (loading.moreValidators || loading.validators) return;

      if (page === 0) {
        setValidators([]);
        setLoading((prevState) => ({ ...prevState, validators: true }));
      }

      if (page > 1) {
        setLoading((prevState) => ({ ...prevState, moreValidators: true }));
        setShowGlobalLoading(true);
      }

      try {
        const response = await api.get(`v1/validators?page=${page}`);

        setValidators((prevState) => [...prevState, ...response.data]);
        setLoading((prevState) => ({
          ...prevState,
          validators: false,
          moreValidators: false
        }));
        setShowGlobalLoading(false);
      } catch {
        setLoading((prevState) => ({
          ...prevState,
          validators: false,
          moreValidators: false
        }));
        setShowGlobalLoading(false);
      }
    },
    [loading.moreValidators, loading.validators, setShowGlobalLoading]
  );

  const fetchValidatorRewards = useCallback(
    async (hotspotUuid: string, days: string) => {
      try {
        const response = await api.get(
          `v1/hotspots/rewards/${hotspotUuid}/${days}`
        );
        setCurrentValidatorRewards(response.data);
      } catch {}
    },
    []
  );

  const fetchValidatorByUuid = useCallback(
    async (walletUuid: string) => {
      try {
        setShowGlobalLoading(true);

        const response = await api.get(`v1/validators/${walletUuid}`);

        setCurrentValidator(response.data);
        setShowGlobalLoading(false);
      } catch {
        setShowGlobalLoading(false);
      }
    },
    [setShowGlobalLoading]
  );

  const value = useMemo(
    () => ({
      validators,
      fetchValidatorByUuid,
      currentValidator,
      loading,
      fetchValidators,
      setCurrentValidator,
      fetchValidatorRewards,
      currentValidatorRewards
    }),
    [
      currentValidator,
      fetchValidatorByUuid,
      fetchValidators,
      loading,
      validators,
      setCurrentValidator,
      fetchValidatorRewards,
      currentValidatorRewards
    ]
  );

  return <ValidatorsContext.Provider value={value} {...props} />;
};

export const useValidators = (): ContextValue => {
  const context = useContext(ValidatorsContext);

  if (context === undefined) {
    throw new Error("useValidators must be used within an ValidatorsProvider");
  }

  return context;
};

//
// Utils
//

interface Loading {
  validators: boolean;
  moreValidators: boolean;
}
