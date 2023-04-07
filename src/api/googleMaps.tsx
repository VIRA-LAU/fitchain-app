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
  return await client
    .distancematrix({
      params: {
        key: GOOGLE_MAPS_API_KEY,
        origins: [userLocationStr],
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
};

export const getLocationName = async (coordinates: LatLng): Promise<string> => {
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
        return locationName;
      } else {
        return "";
      }
    })
    .catch((error) => {
      console.log(error.response.data.error_message);
      return "";
    });
};
