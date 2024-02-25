import { useQuery } from "react-query";
import client from "../../client";

type Response = {
  team: "HOME" | "AWAY" | "none";
};
const getPlayerTeamQuery = (gameId?: number) => async () => {
  if (gameId)
    return await client
      .get(`/games/getTeam/${gameId}`)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("player-team-query", e);
        throw e;
      });
};

export const useGetPlayerTeamQuery = (gameId?: number) => {
  return useQuery<Response>(
    ["player-team", gameId],
    getPlayerTeamQuery(gameId)
  );
};
