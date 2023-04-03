import { useQuery } from "react-query";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";
import { Game } from "src/types";
import { useContext } from "react";

const getGameById = (userData: UserData, id: number) => async () => {
  const header = getHeader(userData);

  return await client
    .get(`/games/${id}`, header)
    .then((res) => {
      console.log("get games" + id);
      return res.data;
    })
    .catch((e) => {
      console.error("game-by-id-query", e);
      throw new Error(e);
    });
};

export const useGameByIdQuery = (id: number) => {
  const { userData } = useContext(UserContext);
  return useQuery<Game>(["games", id], getGameById(userData!, id));
};
