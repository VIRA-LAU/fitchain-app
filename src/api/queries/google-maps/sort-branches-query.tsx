import { useQuery } from "react-query";
import { GOOGLE_MAPS_API_KEY } from "@dotenv";
import { Branch } from "src/types";
import { Client } from "@googlemaps/google-maps-services-js";
import { LatLng } from "react-native-maps";

const client = new Client({});

const sortBranchesByLocation =
  (branches: Branch[] | undefined, userLocation: LatLng) => async () => {
    if (branches && branches.length > 0) {
      const parsedUserLocation = {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      };
      const branchLocations = branches.map(({ latitude, longitude }) => ({
        lat: latitude,
        lng: longitude,
      }));
      return await client
        .distancematrix({
          params: {
            key: GOOGLE_MAPS_API_KEY,
            origins: [parsedUserLocation],
            destinations: branchLocations,
          },
        })
        .then((res) => {
          const rows = res.data.rows;
          const distances = rows[0].elements.map(
            (element: any) => element.distance.value
          );
          const sortedBranches: (Branch & { distance: any })[] = branches
            .map((branch, index) => ({
              ...branch,
              distance: distances[index],
            }))
            .sort((a, b) => a.distance - b.distance);
          return sortedBranches;
        })
        .catch((e) => {
          throw new Error("Failed to fetch distances from Google Maps API");
        });
    }
  };

export const useSortBranchesByLocationQuery = (
  branches: Branch[] | undefined,
  userLocation: LatLng
) => {
  return useQuery<(Branch & { distance: any })[] | undefined>(
    ["sort-branches-by-location", branches],
    sortBranchesByLocation(branches, userLocation)
  );
};
