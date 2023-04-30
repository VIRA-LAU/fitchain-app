import { useQuery } from "react-query";
import { LatLng } from "react-native-maps";
import client, { getHeader } from "src/api/client";
import { UserContext, UserData } from "src/utils";
import { useContext } from "react";
import { Game } from "src/types";

const sortGamesByLocation =
  (userData: UserData, games?: Game[], userLocation?: LatLng) => async () => {
    const header = getHeader(userData);
    if (games && games.length > 0 && userLocation) {
      const gameLocations = games.map((game) => ({
        lat: game.court.branch.latitude,
        lng: game.court.branch.longitude,
      }));
      return await client
        .post(
          "/maps/distance",
          {
            ...userLocation,
            locations: gameLocations,
          },
          header
        )
        .then((res) => res.data)
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
  const { userData } = useContext(UserContext);
  return useQuery<(Game & { distance: any })[] | undefined>(
    ["sort-games-by-location", games],
    sortGamesByLocation(userData!, games, userLocation),
    {
      enabled: false,
    }
  );
};
