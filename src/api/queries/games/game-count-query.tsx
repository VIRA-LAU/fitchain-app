import { useContext } from "react";
import { useQuery } from "react-query";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getGameCount = (userData: UserData, userId?: number) => async () => {
  const header = getHeader(userData);
  if (userId)
    return await client
      .get(`/games/count/${userId}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("game-count-query", e);
        throw new Error(e);
      });
};

export const useGameCountQuery = (userId?: number) => {
  const { userData } = useContext(UserContext);
  return useQuery<number>(
    ["game-count", userId],
    getGameCount(userData!, userId)
  );
};
