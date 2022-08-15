import { capitalize } from "lodash";

const formatHotspotName = (name: string) =>
  name ? name.split("-").map(capitalize).join(" ") : "";

export default formatHotspotName;
