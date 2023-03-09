import { useContext } from "react";
import { useQuery } from "react-query";
import { Game } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getFollowedGames =
  (userData: UserData, type?: "upcoming" | "previous") => async () => {
    const header = getHeader(userData);
    return await client
      .get(`/games/followed${type ? `?type=${type}` : ""}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("followed-games-query", e);
        throw new Error(e);
      });
  };

export const useFollowedGamesQuery = ({
  type,
}: { type?: "upcoming" | "previous" } = {}) => {
  const { userData } = useContext(UserContext);

  return useQuery<{ game: Game }[], unknown, Game[]>(
    ["followed-games", type],
    getFollowedGames(userData!, type),
    {
      select: (games) =>
        games.map(({ game }) => ({ ...game, date: new Date(game.date) })),
    }
  );
};
