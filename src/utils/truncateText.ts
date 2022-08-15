const truncateText = (
  text: string | null,
  outputLength: number,
  separator?: string
) => {
  if (!text) return text;

  if (text.length <= outputLength) return text;

  separator = separator || "...";

  var sepLen = separator.length,
    charsToShow = outputLength - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    text.substr(0, frontChars) +
    separator +
    text.substr(text.length - backChars)
  );
};

export default truncateText;
