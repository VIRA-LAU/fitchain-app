import client from "../../client";
import { useMutation, useQueryClient } from "react-query";

type Request = {
  gameId: number;
  team: "HOME" | "AWAY";
};

type Response = {
  gameId: number;
  status: string;
  team: string;
};

const joinGame = async (data: Request) => {
  return await client
    .post("/gamerequests", data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("join-game-mutation", e);
      throw e;
    });
};

export const useJoinGameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, unknown, Request>({
    mutationFn: joinGame,
    onSuccess: (data, variables) => {
      queryClient.refetchQueries(["playerStatus", variables.gameId]);
      queryClient.refetchQueries(["game", variables.gameId]);
      queryClient.refetchQueries(["games"]);
      queryClient.refetchQueries(["game-players", variables.gameId]);
      queryClient.refetchQueries(["updates", variables.gameId]);
    },
  });
};
