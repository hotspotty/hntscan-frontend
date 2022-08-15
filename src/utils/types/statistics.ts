export interface OraclePrice {
  min: number;
  max: number;
  prices: {
    [key: string]: number;
  };
}
