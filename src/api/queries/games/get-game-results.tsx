import { useQuery } from "react-query";
import client from "src/api/client";
import { Game } from "src/types";

const getGameResults = (gameId: number) => async () => {
  if (gameId)
    return await client
      .get(`/games/results/${gameId}`)
      .then((res) => res.data)
      .catch((e) => console.error("game-results-query", e));
};

export const useGameResultsQuery = (gameId: number) => {
  return useQuery<Game>(["game-results", gameId], getGameResults(gameId), {
    select: (game) => {
      return {
        ...game,
        startTime: new Date(game.startTime),
        endTime: new Date(game.endTime),
      };
    },
  });
};
