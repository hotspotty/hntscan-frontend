import { capitalize } from "lodash";

export const formatTransactionType = (type: string) => {
  switch (type) {
    case "poc_receipts_v1":
      return "Poc Receipt";
    case "poc_receipts_v2":
      return "Poc Receipt";
    case "validator_heartbeat_v1":
      return "Validator Heartbeat";
    case "payment_v1":
      return "Payment";
    case "payment_v2":
      return "Payment";
    case "routing_v1":
      return "Routing";
    case "price_oracle_v1":
      return "Price Oracle";
    case "consensus_group_v1":
      return "Consensus Group";
    case "rewards_v1":
    case "rewards_v2":
    case "rewards_v3":
      return "Mining Rewards";
    case "transfer_validator_stake_v1":
      return "Transfer Stake";
    case "dc_coinbase_v1":
      return "DC Coinbase";
    case "assert_location_v1":
      return "Assert Location";
    case "assert_location_v2":
      return "Assert Location";
    case "add_gateway_v1":
      return "Add Hotspot";
    case "transfer_hotspot_v1":
      return "Transfer Hotspot";
    case "transfer_hotspot_v2 ":
      return "Transfer Hotspot";
    case "state_channel_close_v1":
      return "State Channel Close";
    case "oui_v1":
      return "OUI";
    case "state_channel_open_v1":
      return "State Channel Open";
    case "token_burn_v1":
      return "Token Burn";
    case "token_redeem_v1":
      return "Token Redeem";
    case "unstake_validator_v1":
      return "Unstake Validator";
    case "stake_validator_v1":
      return "Stake Validator";
    case "security_exchange_v1":
      return "Security Exchange";
    case "subnetwork_rewards_v1":
      return "Subnetwork Rewards";
    case "security_coinbase_v1":
      return "Security Coinbase";
    case "gen_gateway_v1":
      return "Genesis Hotspot";
    case "routing_v1":
      return "Routing";
    case "create_htlc_v1":
      return "Create Htlc";
    case "redeem_htlc_v1":
      return "Redeem Htlc";
    case "poc_request_v1":
      return "PoC Challenge";
    case "vars_v1":
      return "Vars";
    case "price_oracle_v1":
      return "Price Oracle";
    case "consensus_group_failure_v1":
      return "Consensus Group Failure";
    default:
      return type.split("_").map(capitalize).join(" ");
  }
};
