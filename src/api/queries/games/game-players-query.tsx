import { useQuery } from "react-query";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";
import { TeamPlayer } from "src/types";
import { Dispatch, SetStateAction, useContext } from "react";

const getGamePlayers = (userData: UserData, id: number) => async () => {
  const header = getHeader(userData);

  return await client
    .get(`/games/players/${id}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("game-players-query", e);
      throw new Error(e);
    });
};

export const useGamePlayersQuery = (
  id: number,
  setLoadingIndex?: Dispatch<SetStateAction<number | null>>
) => {
  const { userData } = useContext(UserContext);
  return useQuery<TeamPlayer[]>(
    ["game-players", id],
    getGamePlayers(userData!, id),
    {
      onSuccess: () => {
        if (setLoadingIndex) setLoadingIndex(null);
      },
    }
  );
};
