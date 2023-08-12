import { useQuery } from "react-query";
import { LatLng } from "react-native-maps";
import client from "src/api/client";
import { Branch } from "src/types";

const sortBranchesByLocation =
  (branches?: Branch[], userLocation?: LatLng) => async () => {
    if (branches && branches.length > 0 && userLocation) {
      const branchLocations = branches.map(({ latitude, longitude }) => ({
        lat: latitude,
        lng: longitude,
      }));
      return await client
        .post("/maps/distance", {
          ...userLocation,
          locations: branchLocations,
        })
        .then((res) => res?.data)
        .then((data) => {
          const sortedBranches: (Branch & { distance: any })[] = branches
            .map((branch, index) => ({
              ...branch,
              distance: data[index],
            }))
            .sort((a, b) => a.distance - b.distance);
          return sortedBranches;
        })
        .catch((e) => {
          console.error("sort-branches-query", e);
          throw e;
        });
    }
  };

export const useSortBranchesByLocationQuery = (
  branches?: Branch[],
  userLocation?: LatLng
) => {
  return useQuery<(Branch & { distance: any })[] | undefined>(
    ["sort-branches-by-location", branches],
    sortBranchesByLocation(branches, userLocation)
  );
};
