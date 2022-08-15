const generateRewardScaleColor = (rewardScale: number) => {
  const factor = 1 / 6;

  if (rewardScale >= factor * 5) {
    return "bg-[#29D344]";
  }

  if (rewardScale >= factor * 4) {
    return "bg-[#9FE14A]";
  }

  if (rewardScale >= factor * 3) {
    return "bg-[#FCC945]";
  }

  if (rewardScale >= factor * 2) {
    return "bg-[#FEA053]";
  }

  if (rewardScale >= factor * 1) {
    return "bg-[#FC8745]";
  }

  return "bg-[#FF6666]";
};

export default generateRewardScaleColor;
