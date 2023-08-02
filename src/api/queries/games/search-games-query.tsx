import { useQuery } from "react-query";
import queryBuilder from "src/api/queryBuilder";
import { Game, GameType } from "src/types";
import client from "../../client";

type Props = {
  gameType: GameType;
  nbOfPlayers: number;
  date?: string;
  startTime?: string;
  endTime?: string;
};

const searchGames = (params?: Props) => async () => {
  return await client
    .get(`/games/search${queryBuilder(params)}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("search-games-query", e);
      throw new Error(e);
    });
};

export const useSearchGamesQuery = (params?: Props) => {
  return useQuery<Game[]>(["games", params], searchGames(params), {
    select: (games) =>
      games.map((game) => ({
        ...game,
        startTime: new Date(game.startTime),
        endTime: new Date(game.endTime),
      })),
  });
};
