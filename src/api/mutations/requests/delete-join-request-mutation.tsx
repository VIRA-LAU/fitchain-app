import client from "../../client";
import { useMutation, useQueryClient } from "react-query";

type Request = {
  requestId: number;
  gameId: number;
};

const deleteJoinRequest = async (data: Request) => {
  return await client
    .delete(`/gamerequests/${data.requestId}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("delete-join-request-mutation", e);
      throw e;
    });
};

export const useDeleteJoinRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, Request>({
    mutationFn: deleteJoinRequest,
    onSuccess: (data, variables) => {
      queryClient.refetchQueries(["playerStatus", variables.gameId]);
      queryClient.refetchQueries(["games"]);
      queryClient.refetchQueries(["game-players", variables.gameId]);
      queryClient.refetchQueries(["updates", variables.gameId]);
    },
  });
};
