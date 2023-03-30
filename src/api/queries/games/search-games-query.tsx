import { useContext } from "react";
import { useQuery } from "react-query";
import queryBuilder from "src/api/queryBuilder";
import { Game, GameType } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

type Props = {
  gameType: GameType;
  date?: string;
  startTime?: string;
  endTime?: string;
};

const searchGames = (userData: UserData, params?: Props) => async () => {
  const header = getHeader(userData);
  return await client
    .get(`/games/search${queryBuilder(params)}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("search-games-query", e);
      throw new Error(e);
    });
};

export const useSearchGamesQuery = (params?: Props) => {
  const { userData } = useContext(UserContext);

  return useQuery<Game[]>(["games", params], searchGames(userData!, params), {
    select: (games) =>
      games.map((game) => ({ ...game, date: new Date(game.date) })),
  });
};
