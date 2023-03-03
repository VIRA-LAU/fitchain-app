import { useQuery } from "react-query";
import { Booking } from "src/types";
import { UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getGames = (userData: UserData) => async () => {
  const header = getHeader(userData);
  return await client
    .get(`/games/upcoming?userId=${userData?.userId}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("games-query", e);
      throw new Error(e);
    });
};

export const useGamesQuery = (userData: UserData) =>
  useQuery<Booking[]>(["games", userData?.userId], getGames(userData));
