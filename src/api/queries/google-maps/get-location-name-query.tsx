import { useQuery } from "react-query";
import { LatLng } from "react-native-maps";
import client, { getHeader } from "src/api/client";
import { UserContext, UserData, VenueData } from "src/utils";
import { useContext } from "react";

const getLocationName =
  (userData: UserData | VenueData, coordinates?: LatLng) => async () => {
    const header = getHeader(userData);
    if (coordinates)
      return await client
        .post("/maps/location-name", coordinates, header)
        .then((res) => res.data)
        .catch((e) => {
          console.error("location-name-query", e.response.data);
          throw new Error(e);
        });
  };

export const useLocationNameQuery = (coordinates?: LatLng) => {
  const { userData, venueData } = useContext(UserContext);
  return useQuery<string | undefined>(
    ["get-location-name", coordinates],
    getLocationName((userData || venueData)!, coordinates),
    {
      enabled: false,
    }
  );
};
