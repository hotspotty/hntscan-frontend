export interface OverviewStats {
  hotspots: {
    online: number;
    total: number;
    trend: {
      last_days: { [key: string]: number };
      start: number;
      end: number;
    };
  };
  hnt_price: {
    price: number;
    percentage: number;
    oracle: number;
  };
  block: {
    height: number;
    change: number;
  };
  dc_spent: number;
  validator: {
    count: number;
    online: number;
    apr: number;
    consensus_number: number;
    stake_withdraw_cooldown: number;
    validator_minimum_stake: number;
    versions: {
      [key: string]: number;
    };
  };
  challenges: number;
  oui_count: number;
  countries: number;
  cities: number;
  circulating_supply: number;
  market_cap: number;
  market_cap_rank: number;
  last_hotspot: {
    hash: string;
    name: string;
    location: string;
    country: string;
    last_maker: {
      count: number;
      name: string;
      address: string;
    };
  };
  last_maker: {
    adress: string;
    count: number;
    name: string;
  };
}
