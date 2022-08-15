import { isEmpty } from "lodash";
import { HotspotLocation } from "./types/hotspots";

const formatLocation = (location: HotspotLocation) => {
  let currentLocation = [];

  if (location.city) {
    currentLocation.push(location.city);
  }

  if (location.country) {
    currentLocation.push(location.country);
  }

  if (isEmpty(currentLocation)) {
    return "Unknown Location";
  }

  return currentLocation.join(", ");
};

export default formatLocation;
