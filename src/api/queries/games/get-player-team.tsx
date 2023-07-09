import { useQuery } from "react-query";
import client from "../../client";

type Response = {
  team: "HOME" | "AWAY" | "none";
};
const getPlayerTeamQuery = (gameId: number) => async () => {
  if (gameId)
    return await client
      .get(`/games/getTeam?gameId=${gameId}`)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("player-team-query", e);
        throw new Error(e);
      });
};

export const useGetPlayerTeamQuery = (id: number) => {
  return useQuery<Response>(["player-team", id], getPlayerTeamQuery(id));
};
