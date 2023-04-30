import { useQuery } from "react-query";
import { LatLng } from "react-native-maps";
import client, { getHeader } from "src/api/client";
import { UserContext, UserData } from "src/utils";
import { useContext } from "react";
import { Branch } from "src/types";

const sortBranchesByLocation =
  (userData: UserData, branches?: Branch[], userLocation?: LatLng) =>
  async () => {
    const header = getHeader(userData);
    if (branches && branches.length > 0 && userLocation) {
      const branchLocations = branches.map(({ latitude, longitude }) => ({
        lat: latitude,
        lng: longitude,
      }));
      return await client
        .post(
          "/maps/distance",
          {
            ...userLocation,
            locations: branchLocations,
          },
          header
        )
        .then((res) => res.data)
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
          throw new Error(e);
        });
    }
  };

export const useSortBranchesByLocationQuery = (
  branches?: Branch[],
  userLocation?: LatLng
) => {
  const { userData } = useContext(UserContext);
  return useQuery<(Branch & { distance: any })[] | undefined>(
    ["sort-branches-by-location", branches],
    sortBranchesByLocation(userData!, branches, userLocation)
  );
};
