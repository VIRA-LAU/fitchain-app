import { useContext } from "react";
import { useQuery } from "react-query";
import { Game, PlayerStatus } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getPlayerStatus = (userData: UserData, gameId: number) => async () => {
  const header = getHeader(userData);
  return await client
    .get(`/games/playerstatus/${gameId}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("player-status-query", e);
      throw new Error(e);
    });
};

export const usePlayerStatusQuery = (gameId: number) => {
  const { userData } = useContext(UserContext);

  return useQuery<PlayerStatus>(
    ["playerStatus", gameId],
    getPlayerStatus(userData!, gameId)
  );
};
