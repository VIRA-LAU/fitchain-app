import client from "../../client";
import { useMutation, useQueryClient } from "react-query";

type Request = {
  playerStatisticsId: number;
  userId: number;
};

const assignPlayerScore = async (data: Request) => {
  return await client
    .patch(`/games/assignPlayerScore/${data.playerStatisticsId}`, data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("assign-player-score-mutation", e);
      throw e;
    });
};

export const useAssignPlayerScoreMutation = (gameId?: number) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, Request>({
    mutationFn: assignPlayerScore,
    onSuccess: () => {
      queryClient.refetchQueries(["game", gameId]);
    },
  });
};
