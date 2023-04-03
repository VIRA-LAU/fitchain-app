import { useQuery } from "react-query";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";
import { TeamPlayer } from "src/types";
import { useContext } from "react";

type Response = {
  team: "Home" | "AWAY" | "none";
};
const getPlayerTeamQuery = (userData: UserData, gameId: number) => async () => {
  const header = getHeader(userData);

  return await client
    .get(`/games/getTeam?gameId=${gameId}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("player-team-query", e);
      throw new Error(e);
    });
};

export const useGetPlayerTeamQuery = (id: number) => {
  const { userData } = useContext(UserContext);
  return useQuery<Response>(
    ["player-team", id],
    getPlayerTeamQuery(userData!, id)
  );
};
