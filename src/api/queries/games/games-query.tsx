import { useQuery } from "react-query";
import queryBuilder from "src/api/queryBuilder";
import { Game } from "src/types";
import client from "../../client";

type Props = {
  limit?: number;
  type?: "upcoming" | "previous";
};

const getGames = (params?: Props) => async () => {
  return await client
    .get(`/games${queryBuilder(params)}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("games-query", e);
      throw new Error(e);
    });
};

export const useGamesQuery = (params?: Props) => {
  return useQuery<Game[]>(["games", params], getGames(params), {
    select: (games) =>
      games.map((game) => ({
        ...game,
        startTime: new Date(game.startTime),
        endTime: new Date(game.endTime),
      })),
  });
};
