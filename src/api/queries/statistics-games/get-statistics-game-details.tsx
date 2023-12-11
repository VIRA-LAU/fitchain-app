import { useQuery } from "react-query";
import client from "src/api/client";
import { StatisticsGame } from "src/types";

const getStatisticsGameDetails = (gameId: number) => async () => {
  if (gameId)
    return await client
      .get(`/statistics-games/${gameId}`)
      .then((res) => res.data)
      .catch((e) => console.error("statistics-game-details-query", e));
};

export const useStatisticsGameDetailsQuery = (gameId: number) => {
  return useQuery<StatisticsGame>(
    ["statistics-games", gameId],
    getStatisticsGameDetails(gameId),
    {
      select: (game) => {
        return {
          ...game,
          startTime: new Date(game.startTime),
          endTime: new Date(game.endTime),
        };
      },
    }
  );
};
