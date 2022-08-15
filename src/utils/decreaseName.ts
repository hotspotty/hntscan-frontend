const decreaseName = (str: string, size: number) => {
  if (str.length > size) {
    return (
      str.substring(0, size) +
      "..." +
      str.substring(str.length - size, str.length)
    );
  }
  return str;
};

export default decreaseName;
