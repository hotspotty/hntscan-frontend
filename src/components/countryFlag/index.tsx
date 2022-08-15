import { Cube } from "components/icons/cube";
import { useMemo } from "react";
import ReactCountryFlag from "react-country-flag";
import formatLocation from "utils/formatLocation";
import { HotspotLocation } from "utils/types/hotspots";

interface Props {
  location: HotspotLocation;
  cubeColor?: string;
}

const CountryFlag: React.FC<Props> = ({ location, cubeColor }) => {
  const locationName = useMemo(() => formatLocation(location), [location]);

  return (
    <span className="flex flex-row items-center justify-start">
      {location.short_country ? (
        <ReactCountryFlag
          countryCode={location.short_country}
          svg
          className="mr-1.5"
        />
      ) : (
        <Cube color={cubeColor} className="w-5 mr-0.5" />
      )}
      {locationName}
    </span>
  );
};

export default CountryFlag;
