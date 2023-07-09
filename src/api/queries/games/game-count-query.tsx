import { useQuery } from "react-query";
import client from "../../client";

const getGameCount = (userId?: number) => async () => {
  if (userId)
    return await client
      .get(`/games/count/${userId}`)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("game-count-query", e);
        throw new Error(e);
      });
};

export const useGameCountQuery = (userId?: number) => {
  return useQuery<number>(["game-count", userId], getGameCount(userId));
};
