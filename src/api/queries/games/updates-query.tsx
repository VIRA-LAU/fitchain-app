import { useQuery } from "react-query";
import { GameUpdate } from "src/types";
import client from "../../client";

const getUpdates = (gameId?: number) => async () => {
  if (gameId)
    return await client
      .get(`/games/updates/${gameId}`)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("updates-query", e);
        throw e;
      });
};

export const useUpdatesQuery = (gameId?: number) => {
  return useQuery<GameUpdate>(["updates", gameId], getUpdates(gameId));
};
