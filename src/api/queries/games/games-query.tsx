import { useQuery } from "react-query";
import client from "../../client";

const getGames = () => async () => {
  return await client
    .get(`/games`)
    .then((res) => res.data)
    .catch((e) => {
      console.error("games-query", e);
      throw new Error(e);
    });
};

export const useGamesQuery = () => useQuery(["games"], getGames());
