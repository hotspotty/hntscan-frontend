export interface WalletListItem {
  data_type: "wallet";
  address: string;
  balance: WalletBalance;
  hotspot_count: number;
  validator_count: number;
  last_block: number;
}

export interface Wallet {
  data_type: "wallet";
  address: string;
  hotspot_count: number;
  validator_count: number;
  balance: WalletBalance;
  rewards: {
    [key: string]: number;
  };
  rewards_24h: {
    [key: string]: number;
  };
}

interface WalletBalance {
  hst: number;
  dc: number;
  hnt: number;
  stake: number;
  mobile: number;
  iot: number;
}
