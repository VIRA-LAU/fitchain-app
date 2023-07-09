import client from "../../client";
import { useMutation, useQueryClient } from "react-query";

type Request = {
  gameId: number;
};

type Response = {
  id: number;
  gameId: number;
  userId: number;
};

const followGame = async (data: Request) => {
  return await client
    .post("/games/followed", data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("follow-game-mutation", e);
      throw new Error(e);
    });
};

export const useFollowGameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, unknown, Request>({
    mutationFn: followGame,
    onSuccess: () => {
      queryClient.refetchQueries(["followed-games"]);
    },
  });
};
