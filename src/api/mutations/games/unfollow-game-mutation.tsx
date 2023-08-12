import client from "../../client";
import { useMutation, useQueryClient } from "react-query";

type Request = {
  gameId: number;
};

const unfollowGame = async (data: Request) => {
  return await client
    .delete(`/games/followed?gameId=${data.gameId}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("unfollow-game-mutation", e);
      throw e;
    });
};

export const useUnfollowGameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, Request>({
    mutationFn: unfollowGame,
    onSuccess: () => {
      queryClient.refetchQueries(["followed-games"]);
    },
  });
};
