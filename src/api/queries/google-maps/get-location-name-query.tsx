import { useQuery } from "react-query";
import { LatLng } from "react-native-maps";
import client from "src/api/client";

const getLocationName = (coordinates?: LatLng) => async () => {
  if (coordinates)
    return await client
      .post("/maps/location-name", coordinates)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("location-name-query", e.response.data);
        throw new Error(e);
      });
};

export const useLocationNameQuery = (coordinates?: LatLng) => {
  return useQuery<string | undefined>(
    ["get-location-name", coordinates],
    getLocationName(coordinates),
    {
      enabled: false,
    }
  );
};
