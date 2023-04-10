import { useQuery } from "react-query";
import { GOOGLE_MAPS_API_KEY } from "@dotenv";
import { Game } from "src/types";
import { Client } from "@googlemaps/google-maps-services-js";
import { LatLng } from "react-native-maps";

const client = new Client({});

const sortGamesByLocation =
  (games: Game[] | undefined, userLocation: LatLng) => async () => {
    if (games) {
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
    }
  };

export const useSortGamesByLocationQuery = (
  games: Game[] | undefined,
  userLocation: LatLng
) => {
  return useQuery<(Game & { distance: any })[] | undefined>(
    ["sort-games-by-location", games],
    sortGamesByLocation(games, userLocation),
    {
      enabled: false,
    }
  );
};
