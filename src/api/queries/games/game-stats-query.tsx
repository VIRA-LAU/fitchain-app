import { useQuery } from "react-query";
import { GameStats } from "src/types";
import client from "../../client";

const getGameStats = (gameId?: number) => async () => {
  return {
    videoPath: "",
    highlights: [
      "https://fitchain-ai-videos.s3.eu-north-1.amazonaws.com/videos_input/test.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    ],
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
