import React from "react";
import { AppearenceProvider } from "./appearence";
import { BlocksProvider } from "./blocks";
import { ExplorerProvider } from "./explorer";
import { HotspotsProvider } from "./hotspots";
import { StatisticsProvider } from "./statistics";
import { TransactionsProvider } from "./transactions";
import { ValidatorsProvider } from "./validators";
import { WalletsProvider } from "./wallets/index";

interface Props {
  children: JSX.Element;
}

const AppProvider: React.FC<Props> = ({ children }) => (
  <AppearenceProvider>
    <StatisticsProvider>
      <BlocksProvider>
        <WalletsProvider>
          <TransactionsProvider>
            <HotspotsProvider>
              <ValidatorsProvider>
                <ExplorerProvider>{children}</ExplorerProvider>
              </ValidatorsProvider>
            </HotspotsProvider>
          </TransactionsProvider>
        </WalletsProvider>
      </BlocksProvider>
    </StatisticsProvider>
  </AppearenceProvider>
);

export default AppProvider;
