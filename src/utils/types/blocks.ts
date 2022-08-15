export interface BlockTransaction {
  type: string;
  hash: string;
}

export interface Block {
  height: number;
  time: number;
  hash: string;
  transaction_count: number;
  block_transactions: BlockTransaction[];
  data_type: "block";
}
