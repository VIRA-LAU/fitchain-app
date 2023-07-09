import { useQuery } from "react-query";
import { LatLng } from "react-native-maps";
import client from "src/api/client";
import { Game } from "src/types";

const sortGamesByLocation =
  (games?: Game[], userLocation?: LatLng) => async () => {
    if (games && games.length > 0 && userLocation) {
      const gameLocations = games.map((game) => ({
        lat: game.court.branch.latitude,
        lng: game.court.branch.longitude,
      }));
      return await client
        .post("/maps/distance", {
          ...userLocation,
          locations: gameLocations,
        })
        .then((res) => res?.data)
        .then((data) => {
          const sortedGames: (Game & { distance: any })[] = games
            .map((game, index) => ({
              ...game,
              distance: data[index],
            }))
            .sort((a, b) => a.distance - b.distance);
          return sortedGames;
        })
        .catch((e) => {
          console.error("sort-games-query", e);
          throw new Error(e);
        });
    }
  };

export const useSortGamesByLocationQuery = (
  games?: Game[],
  userLocation?: LatLng
) => {
  return useQuery<(Game & { distance: any })[] | undefined>(
    ["sort-games-by-location", games],
    sortGamesByLocation(games, userLocation),
    {
      enabled: false,
    }
  );
};
