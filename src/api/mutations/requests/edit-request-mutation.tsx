import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { GameRequest } from "src/types";

type Request = {
  requestId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  gameId: number;
};

const editJoinRequest = async (data: Request) => {
  return await client
    .patch(`/gamerequests/${data.requestId}`, { status: data.status })
    .then((res) => res?.data)
    .catch((e) => {
      console.error("edit-join-request-mutation", e);
      throw new Error(e);
    });
};

export const useEditJoinRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<GameRequest, unknown, Request>({
    mutationFn: editJoinRequest,
    onSuccess: (data, variables) => {
      queryClient.refetchQueries("received-requests");
      queryClient.refetchQueries(["game-players", variables.gameId]);
      queryClient.refetchQueries(["updates", variables.gameId]);
    },
  });
};
