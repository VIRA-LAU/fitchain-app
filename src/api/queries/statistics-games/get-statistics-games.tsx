import { useQuery } from "react-query";
import client from "src/api/client";
import { StatisticsGame } from "src/types";

const getStatisticsGames = (userId?: number) => async () => {
  if (userId)
    return await client
      .get(`/statistics-games/user/${userId}`)
      .then((res) => res.data)
      .catch((e) => console.error("statistics-games-query", e));
};

export const useStatisticsGamesQuery = (userId?: number) => {
  return useQuery<StatisticsGame[]>(
    "statistics-games",
    getStatisticsGames(userId),
    {
      select: (data) => {
        return data.map((game) => ({
          ...game,
          startTime: new Date(game.startTime),
          endTime: new Date(game.endTime),
        }));
      },
    }
  );
};
