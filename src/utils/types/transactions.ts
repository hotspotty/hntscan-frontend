export interface TransactionFields {
  block_hash: string;
  challenger: string;
  challenger_owner: string;
  fee: number;
  hash: string;
  onion_key_hash: string;
  path: Path | null;
  secret: string;
  type: string;
}

export interface PocV1 {
  challenger: string;
  challenger_location: string;
  challenger_owner: string;
  fee: number;
  hash: string;
  onion_key_hash: string;
  path: Path;
  request_block_hash: string;
  secret: string;
  type: string;
  data_type: "poc_receipts_v1";
}

export interface PocV2 {
  block_hash: string;
  challenger: string;
  challenger_owner: string;
  fee: number;
  hash: string;
  onion_key_hash: string;
  path: Path;
  secret: string;
  type: string;
  data_type: "poc_receipts_v2";
}

interface Path {
  challengee: string;
  challengee_location: string;
  challengee_owner: string;
  receipt: {
    channel: number;
    data: string;
    datarate: string;
    frequency: number;
    gateway: string;
    origin: string;
    signal: number;
    snr: number;
    timestamp: number;
    tx_power: number;
  };
  witnesses: {
    channel: number;
    datarate: string;
    frequency: number;
    gateway: string;
    is_valid: boolean;
    location: string;
    owner: string;
    packet_hash: string;
    signal: number;
    snr: number;
    timestamp: number;
  }[];
}

export interface ValidatorHeartbeatV1 {
  address: string;
  hash: string;
  height: number;
  signature: string;
  version: number;
  type: "validator_heartbeat_v1";
  data_type: "validator_heartbeat_v1";
}

export interface PaymentV1 {
  amount: number;
  fee: number;
  hash: string;
  nonce: number;
  payee: string;
  payer: string;
  type: string;
  data_type: "payment_v1";
}

export interface PaymentV2 {
  fee: number;
  hash: string;
  nonce: number;
  payments: {
    amount: number;
    memo: string;
    payee: string;
    token_type?: "HNT" | "MOBILE" | "IOT" | "HST";
  }[];
  // TODO: double check if there are other amounts added after the MOBILE launch https://github.com/helium/helium-js/blob/6ca46b0484c8d2e6f140655979b70a6d7a73eaf9/packages/http/src/models/Transaction.ts#L710
  payer: string;
  type: "payment_v2";
  data_type: "payment_v2";
}

export interface TransferValidatorStakeV1 {
  fee: number;
  hash: string;
  new_address: string;
  new_owner: string;
  new_owner_signature: string;
  old_address: string;
  old_owner: string;
  old_owner_signature: string;
  payment_amount: number;
  stake_amount: number;
  type: string;
  data_type: "transfer_validator_stake_v1";
}

export interface DcCoinbaseV1 {
  amount: number;
  hash: string;
  payee: string;
  type: string;
  data_type: "dc_coinbase_v1";
}

export interface Reward {
  start_epoch: number;
  end_epoch: number;
  consensus: number;
  consensus_amount: number;
  data_credits: number;
  data_credits_amount: number;
  overages: number;
  overages_amount: number;
  poc_challengees: number;
  poc_challengees_amount: number;
  poc_challengers: number;
  poc_challengers_amount: number;
  poc_witnesses: number;
  poc_witnesses_amount: number;
  securities: number;
  securities_amount: number;
}

export interface RewardsV1 extends Reward {
  data_type: "rewards_v1";
}

export interface RewardsV2 extends Reward {
  data_type: "rewards_v2";
}

export interface RewardsV3 extends Reward {
  data_type: "rewards_v3";
}

export interface AssertLocationV1 {
  fee: number;
  gateway: string;
  hash: string;
  location: string;
  nonce: number;
  owner: string;
  payer: string;
  staking_fee: number;
  type: string;
  data_type: "assert_location_v1";
  timestamp: number; // Added by Daniel
}

export interface AddGatewayV1 {
  fee: number;
  gateway: string;
  hash: string;
  owner: string;
  payer: string;
  staking_fee: number;
  type: string;
  data_type: "add_gateway_v1";
  timestamp: number; // Added by Daniel
}

export interface ConsensusGroupV1 {
  type: "consensus_group_v1";
  data_type: "consensus_group_v1";
  delay: number;
  hash: string;
  height: number;
  members: string[];
  proof: string;
}

export interface TransferHotspotV1 {
  fee: number;
  hash: string;
  buyer: string;
  seller: string;
  gateway: string;
  buyer_nonce: number;
  amount_to_seller: number;
  type: "transfer_hotspot_v1";
  data_type: "transfer_hotspot_v1";
}

export interface TransferHotspotV2 {
  fee: number;
  hash: string;
  new_owner: string;
  owner: string;
  gateway: string;
  nonce: number;
  type: "transfer_hotspot_v2";
  data_type: "transfer_hotspot_v2";
}

export interface AssertLocationV2 {
  elevation: number;
  fee: number;
  gain: number;
  gateway: string;
  hash: string;
  location: string;
  nonce: number;
  owner: string;
  payer: string;
  staking_fee: number;
  type: "assert_location_v2";
  data_type: "assert_location_v2";
  timestamp: number; // Added by Daniel
}

export interface TokenBurnV1 {
  fee: number;
  hash: string;
  memo: string;
  nonce: number;
  payee: string;
  payer: string;
  amount: number;
  type: "token_burn_v1";
  data_type: "token_burn_v1";
}

export interface UnstakeValidatorV1 {
  address: string;
  fee: number;
  hash: string;
  owner: string;
  owner_signature: string;
  stake_amount: number;
  stake_release_height: number;
  type: "unstake_validator_v1";
  data_type: "unstake_validator_v1";
}

export interface StakeValidatorV1 {
  address: string;
  fee: number;
  hash: string;
  owner: string;
  owner_signature: string;
  stake: number;
  type: "stake_validator_v1";
  data_type: "stake_validator_v1";
}

export interface StateChannelDataSummary {
  client: string; // hotspot uuid
  location: string; // res12 hex of hotspot
  num_dcs: number;
  num_packets: number;
  owner: string;
}

export interface StateChannel {
  expire_at_block: number;
  id: string;
  nonce: number;
  owner: string;
  root_hash: string;
  state: string;
  summaries: StateChannelDataSummary[];
}

export interface StateChannelCloseV1 {
  closer: string;
  conflicts_with: null;
  hash: string;
  state_channel: StateChannel;
  type: "state_channel_close_v1";
  data_type: "state_channel_close_v1";
}

export interface StateChannelOpenV1 {
  amount: number;
  expire_within: number;
  fee: number;
  hash: string;
  id: string;
  nonce: number;
  oui: number;
  owner: string;
  type: "state_channel_open_v1";
  data_type: "state_channel_open_v1";
}

export interface SecurityExchangeV1 {
  amount: number;
  fee: number;
  hash: string;
  nonce: number;
  payee: string;
  payer: string;
  type: "security_exchange_v1";
  data_type: "security_exchange_v1";
}

export interface OuiV1 {
  addresses: string[];
  fee: number;
  filter: string;
  hash: string;
  oui: number;
  owner: string;
  payer: string;
  requested_subnet_size: number;
  staking_fee: number;
  type: "oui_v1";
  data_type: "oui_v1";
}

export interface SubnetworkRewardsV1 {
  hash: string;
  rewards: {
    type: "subnetwork_reward";
    amount: number;
    account: string;
  }[];
  token_type: string;
  end_epoch: number;
  start_epoch: number;
  type: "subnetwork_rewards_v1";
  data_type: "subnetwork_rewards_v1";
}

export interface TokenRedeemV1 {
  account: string;
  amount: number;
  token_type: string;
  nonce: number;
  time: number;
  height: number;
  hash: string;
  type: "token_redeem_v1";
  data_type: "token_redeem_v1";
}

export interface SecurityCoinbaseV1 {
  amount: number;
  hash: string;
  payee: string;
  type: "security_coinbase_v1";
  data_type: "security_coinbase_v1";
}

export interface GenGatewayV1 {
  gateway: string;
  hash: string;
  location: string;
  nonce: number;
  owner: string;
  type: "gen_gateway_v1";
  data_type: "gen_gateway_v1";
}

export interface RoutingV1 {
  fee: number;
  oui: number;
  hash: string;
  nonce: number;
  owner: string;
  action: {
    index: number;
    action: string;
    filter: string;
  };
  type: "routing_v1";
  data_type: "routing_v1";
}

export interface CreateHtlcV1 {
  address: string;
  amount: number;
  fee: number;
  hash: string;
  hashlock: string;
  nonce: number;
  payee: string;
  payer: string;
  timelock: number;
  type: "create_htlc_v1";
  data_type: "create_htlc_v1";
}

export interface RedeemHtlcV1 {
  address: string;
  fee: number;
  hash: string;
  payee: string;
  preimage: string;
  type: "redeem_htlc_v1";
  data_type: "redeem_htlc_v1";
}

export interface PocRequestV1 {
  block_hash: string;
  challenger: string;
  challenger_location: string;
  challenger_owner: string;
  fee: number;
  hash: string;
  onion_key_hash: string;
  secret_hash: string;
  version: number;
  type: "poc_request_v1";
  data_type: "poc_request_v1";
}

export interface VarsV1 {
  hash: string;
  proof: string;
  key_proof: string;
  master_key: string;
  nonce: number;
  version_predicate: number;
  cancels: string[]; // Not sure
  unsets: string[];
  vars: {
    [key: string]: string | number;
  };
  type: "vars_v1";
  data_type: "vars_v1";
}

export interface PriceOracleV1 {
  block_height: number;
  fee: number;
  hash: string;
  price: number;
  public_key: string;
  type: "price_oracle_v1";
  data_type: "price_oracle_v1";
}

export interface ConsensusGroupFailureV1 {
  delay: number;
  hash: string;
  height: number;
  members: string[];
  signatures: string[];
  failed_members: string[];
  type: "consensus_group_failure_v1";
  data_type: "consensus_group_failure_v1";
}

export type TransactionResponse =
  | PocV1
  | PocV2
  | OuiV1
  | ValidatorHeartbeatV1
  | PaymentV1
  | PaymentV2
  | DcCoinbaseV1
  | RewardsV1
  | RewardsV2
  | RewardsV3
  | AssertLocationV1
  | AddGatewayV1
  | TransferValidatorStakeV1
  | TransferHotspotV1
  | TransferHotspotV2
  | AssertLocationV2
  | TokenBurnV1
  | UnstakeValidatorV1
  | StakeValidatorV1
  | StateChannelCloseV1
  | StateChannelOpenV1
  | SecurityExchangeV1
  | SubnetworkRewardsV1
  | TokenRedeemV1
  | ConsensusGroupV1
  | SecurityCoinbaseV1
  | GenGatewayV1
  | RoutingV1
  | CreateHtlcV1
  | RedeemHtlcV1
  | PocRequestV1
  | VarsV1
  | PriceOracleV1
  | ConsensusGroupFailureV1;

export interface Transaction {
  height: number;
  hash: string;
  type: string;
  time: number;
  fields: string;
  data_type: "transaction";
}

export interface Rewards {
  account: string;
  amount: number;
  gateway: string;
  type: string;
}
