import { useQuery } from "react-query";
import { GOOGLE_MAPS_API_KEY } from "@dotenv";
import { VenueBranch } from "src/types";
import { Client } from "@googlemaps/google-maps-services-js";
import { LatLng } from "react-native-maps";

const client = new Client({});

const sortBranchesByLocation =
  (branches: VenueBranch[] | undefined, userLocation: LatLng) => async () => {
    if (branches) {
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
          const sortedBranches: (VenueBranch & { distance: any })[] = branches
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
  branches: VenueBranch[] | undefined,
  userLocation: LatLng
) => {
  return useQuery<(VenueBranch & { distance: any })[] | undefined>(
    ["sort-branches-by-location", branches],
    sortBranchesByLocation(branches, userLocation)
  );
};
