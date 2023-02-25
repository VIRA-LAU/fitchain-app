import { useQuery } from "react-query";
import { useAxios } from "../../client";

const getGames = (userId: number) => async () => {
  const client = useAxios();
  return await client
    .get(`/games?userId=${userId}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error("games-query", e);
      throw new Error(e);
    });
};

export const useGamesQuery = (userId: number) =>
  useQuery(["games", userId], getGames(userId));
