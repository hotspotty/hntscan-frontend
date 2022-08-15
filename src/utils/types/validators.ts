export interface Validator {
  data_type: "validator";
  address: string;
  name: string;
  online: string;
  version_heartbeat: number;
  last_heartbeat: number;
  staked: string;
  owner: string;
  penalty_score: number;
  penalties: {
    amount: number;
    height: number;
    type: "performance" | "tenure";
  }[];
  rewards: {
    [key: string]: number;
  };
  rewards_24h: {
    [key: string]: number;
  };
}
