import client from "../../client";
import { useMutation, useQueryClient } from "react-query";

type Request = {
  gameId?: number;
};

type Response = {
  id: number;
  gameId: number;
  userId: number;
};

const followGame = async (data: Request) => {
  if (data.gameId)
    return await client
      .post(`/games/follow/${data.gameId}`)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("follow-game-mutation", e);
        throw e;
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
