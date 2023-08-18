import { useQuery } from "react-query";
import { Activity, GameStats } from "src/types";
import client from "../../client";

const getGameStats = (gameId?: number) => async () => {
  return {
    videoPath: "" as any,
    team1: {
      playerPoints: {
        player1: {
          scored: 17,
          missed: 3,
        },
        player2: {
          scored: 13,
          missed: 5,
        },
      },
      points: 30,
      possession: "59%",
    },
    team2: {
      playerPoints: {
        player1: {
          scored: 9,
          missed: 4,
        },
        player2: {
          scored: 11,
          missed: 5,
        },
      },
      points: 20,
      possession: "41%",
    },
  };
  //   if (gameId)
  //     return await client
  //       .get(`/games/stats/${gameId}`)
  //       .then((res) => res?.data)
  //       .catch((e) => {
  //         console.error("game-stats-query", e);
  //         throw e;
  //       });
};

export const useGameStatsQuery = (gameId?: number) => {
  return useQuery<GameStats>(["game-stats", gameId], getGameStats(gameId));
};
