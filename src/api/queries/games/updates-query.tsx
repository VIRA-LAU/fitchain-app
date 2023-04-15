import { useContext } from "react";
import { useQuery } from "react-query";
import { GameUpdate } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getUpdates = (userData: UserData, gameId?: number) => async () => {
  const header = getHeader(userData);

  if (gameId)
    return await client
      .get(`/games/updates/${gameId}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("updates-query", e);
        throw new Error(e);
      });
};

export const useUpdatesQuery = (gameId?: number) => {
  const { userData } = useContext(UserContext);
  return useQuery<GameUpdate>(
    ["updates", gameId],
    getUpdates(userData!, gameId)
  );
};
