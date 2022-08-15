import toast from "react-hot-toast";
const copyToClipboard = (value: string) => {
  if (!value) return;
  navigator.clipboard.writeText(value);
  toast.success("Copied");
};
export default copyToClipboard;
