import { useQuery } from "react-query";
import { Game } from "src/types";
import client from "../../client";

const getFollowedGames = (type?: "upcoming" | "previous") => async () => {
  return await client
    .get(`/games/followed${type ? `?type=${type}` : ""}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("followed-games-query", e);
      throw new Error(e);
    });
};

export const useFollowedGamesQuery = ({
  type,
}: { type?: "upcoming" | "previous" } = {}) => {
  return useQuery<{ game: Game }[], unknown, Game[]>(
    ["followed-games", type],
    getFollowedGames(type),
    {
      select: (games) =>
        games.map(({ game }) => ({ ...game, date: new Date(game.date) })),
    }
  );
};
