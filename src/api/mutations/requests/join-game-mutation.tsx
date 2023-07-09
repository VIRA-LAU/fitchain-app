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
      throw new Error(e);
    });
};

export const useJoinGameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, unknown, Request>({
    mutationFn: joinGame,
    onSuccess: (data) => {
      queryClient.setQueryData(["playerStatus", data.gameId], {
        hasRequestedtoJoin: "PENDING",
        hasBeenInvited: false,
        isAdmin: false,
      });
      queryClient.refetchQueries(["playerStatus", data.gameId]);
      queryClient.refetchQueries(["games"]);
      queryClient.refetchQueries(["game-players", data.gameId]);
      queryClient.refetchQueries(["updates", data.gameId]);
    },
  });
};
