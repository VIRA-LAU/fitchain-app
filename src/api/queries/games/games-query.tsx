import { useContext } from "react";
import { useQuery } from "react-query";
import { Game } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

type Props = {
  limit?: number;
  type?: "upcoming" | "previous";
};

const queryBuilder = (params?: any) => {
  if (!params) return "";
  const keys = Object.keys(params);
  if (keys.length === 1) return `?${keys[0]}=${params[keys[0]]}`;
  else {
    let output = "?";
    Object.keys(params).forEach((key, index: number) => {
      output = output + key + "=" + params[key];
      if (index + 1 !== keys.length) output = output + "&";
    });
    return output;
  }
};

const getGames = (userData: UserData, params?: Props) => async () => {
  const header = getHeader(userData);
  return await client
    .get(`/games${queryBuilder(params)}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("games-query", e);
      throw new Error(e);
    });
};

export const useGamesQuery = (params?: Props) => {
  const { userData } = useContext(UserContext);

  return useQuery<Game[]>(["games", params], getGames(userData!, params), {
    select: (games) =>
      games.map((game) => ({ ...game, date: new Date(game.date) })),
  });
};
