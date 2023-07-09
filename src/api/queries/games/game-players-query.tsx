import { useQuery } from "react-query";
import client from "../../client";
import { TeamPlayer } from "src/types";
import { Dispatch, SetStateAction } from "react";

const getGamePlayers = (id: number) => async () => {
  return await client
    .get(`/games/players/${id}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("game-players-query", e);
      throw new Error(e);
    });
};

export const useGamePlayersQuery = (
  id: number,
  setLoadingIndex?: Dispatch<SetStateAction<number | null>>
) => {
  return useQuery<TeamPlayer[]>(["game-players", id], getGamePlayers(id), {
    onSuccess: () => {
      if (setLoadingIndex) setLoadingIndex(null);
    },
  });
};
