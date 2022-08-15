import { AddGatewayV1, AssertLocationV2 } from "./transactions";

export interface Witnesses {
  hash: string;
  distance: number;
  datarate: string;
  rssi: number;
  snr: number;
  frequency: number;
  valid: boolean;
  timestamp: number;
  channel: number;
  location: string;
}

export interface ActivityWitnesses {
  hash: string;
  time: number;
  block: number;
  distance: number;
  challenger: string;
  challenger_location: string;
  beaconer: string;
  beaconer_location: string;
  valid: boolean;
  valid_count: number;
  invalid_count: number;
  witnesses: Witnesses[];
}

export interface ActivityChalangers {
  hash: string;
  time: number;
  block: number;
  challenger: string;
  challenger_location: string;
  beaconer: string;
  beaconer_location: string;
  valid_count: number;
  invalid_count: number;
  witnesses: Witnesses[];
}

export interface ActivityChalangees {
  hash: string;
  time: number;
  block: number;
  challenger: string;
  challenger_location: string;
  beaconer: string;
  beaconer_location: string;
  valid_count: number;
  invalid_count: number;
  witnesses: Witnesses[];
}

export interface ActivityRewards {
  hash: string;
  time: number;
  block: number;
  amount: number;
}

export interface HotspotActivity {
  witnesses: ActivityWitnesses[];
  challengers: ActivityChalangers[];
  challengees: ActivityChalangees[];
  rewards: ActivityRewards[];
  data_packets: any[];
  gateway_data: Array<AssertLocationV2 | AddGatewayV1 | AssertLocationV2>;
}

export interface Hotspot {
  address: string;
  id: string;
  name: string;
  maker: string;
  owner: string;
  location: HotspotLocation;
  payer: string;
  data_type: "hotspot";
  last_poc_challenge: number;
  witness_count: number;
  first_block: number;
  last_block: number;
  first_timestamp: number;
  nonce: number;
  reward_scale: number;
  elevation: number;
  gain: number;
  activity_timestamp: number;
  activity_tx: string;
}

export interface HotspotLocation {
  location: string;
  country: string;
  city: string;
  street: string;
  short_country: string;
}

export interface HotspotStatus {
  hotspot_id: string;
  active: {
    active: boolean;
    timestamp: number;
    tx: string;
  };
}
