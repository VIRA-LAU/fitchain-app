import { GOOGLE_MAPS_API_KEY } from "@dotenv";
import { VenueBranch } from "src/types";
import { Client } from "@googlemaps/google-maps-services-js";
import { LatLng } from "react-native-maps";

const client = new Client({});

export const sortBranchesByLocation = async (
  branches: VenueBranch[],
  userLocation: LatLng
): Promise<(VenueBranch & { distance: any })[]> => {
  const userLocationStr = {
    lat: userLocation.latitude,
    lng: userLocation.longitude,
  };
  const branchLocations = branches.map(({ latitude, longitude }) => ({
    lat: latitude,
    lng: longitude,
  }));
  const response = await client.distancematrix({
    params: {
      key: GOOGLE_MAPS_API_KEY,
      origins: [userLocationStr],
      destinations: branchLocations,
    },
  });
  if (response.status === 200) {
    const rows = response.data.rows;
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
  } else {
    throw new Error("Failed to fetch distances from Google Maps API");
  }
};
