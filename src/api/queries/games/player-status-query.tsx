import { useQuery } from "react-query";
import { PlayerStatus } from "src/types";
import client from "../../client";

const getPlayerStatus = (gameId: number) => async () => {
  return await client
    .get(`/games/playerstatus/${gameId}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("player-status-query", e);
      throw new Error(e);
    });
};

export const usePlayerStatusQuery = (gameId: number) => {
  return useQuery<PlayerStatus>(
    ["playerStatus", gameId],
    getPlayerStatus(gameId)
  );
};
