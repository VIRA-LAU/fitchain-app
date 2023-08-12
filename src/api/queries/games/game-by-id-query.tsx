import { useQuery } from "react-query";
import client from "../../client";
import { Game } from "src/types";

const getGameById = (id: number) => async () => {
  return await client
    .get(`/games/${id}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("game-by-id-query", e);
      throw e;
    });
};

export const useGameByIdQuery = (id: number) => {
  return useQuery<Game>(["games", id], getGameById(id), {
    select: (game) => ({
      ...game,
      startTime: new Date(game.startTime),
      endTime: new Date(game.endTime),
    }),
  });
};
