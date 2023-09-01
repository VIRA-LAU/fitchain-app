import client from "../../client";
import { useMutation, useQueryClient } from "react-query";

type Request = {
  playerStatisticsId: number;
  userId: number;
  gameId: number;
};

const assignPlayerScore = async (data: Request) => {
  return await client
    .patch(`/games/assignPlayerScore`, data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("assign-player-score-mutation", e);
      throw e;
    });
};

export const useAssignPlayerScoreMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, Request>({
    mutationFn: assignPlayerScore,
    onSuccess: (data, variables) => {
      queryClient.refetchQueries(["game", variables.gameId]);
    },
  });
};
