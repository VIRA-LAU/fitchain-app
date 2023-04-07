import { GOOGLE_MAPS_API_KEY } from "@dotenv";
import { Game, VenueBranch } from "src/types";
import { Client } from "@googlemaps/google-maps-services-js";
import { LatLng } from "react-native-maps";

const client = new Client({});

export const sortBranchesByLocation = async (
  branches: VenueBranch[],
  userLocation: LatLng
): Promise<(VenueBranch & { distance: any })[]> => {
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
};

export const sortGamesByLocation = async (
  games: Game[],
  userLocation: LatLng
): Promise<(Game & { distance: any })[]> => {
  const parsedUserLocation = {
    lat: userLocation.latitude,
    lng: userLocation.longitude,
  };
  const gameLocations = games.map((game) => ({
    lat: game.court.branch.latitude,
    lng: game.court.branch.longitude,
  }));
  return await client
    .distancematrix({
      params: {
        key: GOOGLE_MAPS_API_KEY,
        origins: [parsedUserLocation],
        destinations: gameLocations,
      },
    })
    .then((res) => {
      const rows = res.data.rows;
      const distances = rows[0].elements.map(
        (element: any) => element.distance.value
      );
      const sortedGames: (Game & { distance: any })[] = games
        .map((game, index) => ({
          ...game,
          distance: distances[index],
        }))
        .sort((a, b) => a.distance - b.distance);
      return sortedGames;
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
