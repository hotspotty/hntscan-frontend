import { round } from "lodash";

const formatLargeNumber = (value: number | undefined, digits: number = 2) => {
  if (!value) return "0";

  const BILLION = 1_000_000_000;
  const MILLION = 1_000_000;
  const THOUSAND = 1_000;

  if (value >= BILLION) {
    return [
      round(value / BILLION, 3).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      "B"
    ].join("");
  }

  if (value >= MILLION) {
    return [
      round(value / MILLION, 3).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      "M"
    ].join("");
  }

  if (value >= THOUSAND) {
    return [
      round(value / THOUSAND, 3).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      "K"
    ].join("");
  }

  if (value >= 1) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  return value;
};

export default formatLargeNumber;
