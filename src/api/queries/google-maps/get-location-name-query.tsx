import { useQuery } from "react-query";
import { GOOGLE_MAPS_API_KEY } from "@dotenv";
import { Client } from "@googlemaps/google-maps-services-js";
import { LatLng } from "react-native-maps";

const client = new Client({});

const getLocationName = (coordinates: LatLng | undefined) => async () => {
  console.log(coordinates, GOOGLE_MAPS_API_KEY);
  if (coordinates) {
    const parsedCoordinates = {
      lat: coordinates.latitude,
      lng: coordinates.longitude,
    };
    return await client
      .reverseGeocode({
        params: {
          latlng: parsedCoordinates,
          key: GOOGLE_MAPS_API_KEY,
        },
      })
      .then((res) => {
        const results = res.data.results;
        if (results.length > 0) {
          const locationNameArr = results[0].formatted_address.split(" ");
          if (locationNameArr[0].includes("+")) locationNameArr.shift();
          const locationName = locationNameArr.join(" ");
          if (!locationName) return "Unknown";
          return locationName;
        } else {
          return "Unknown";
        }
      })
      .catch((error) => {
        console.log(error.response.data.error_message);
        return "Unknown";
      });
  }
};

export const useLocationNameQuery = (coordinates: LatLng | undefined) => {
  return useQuery<string | undefined>(
    ["get-location-name", coordinates],
    getLocationName(coordinates),
    {
      enabled: false,
    }
  );
};
