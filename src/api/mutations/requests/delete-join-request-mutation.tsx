import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";

type Request = {
  requestId: number;
  gameId: number;
};

const deleteJoinRequest = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .delete(`/gamerequests/${data.requestId}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("delete-join-request-mutation", e);
      throw new Error(e);
    });
};

export const useDeleteJoinRequestMutation = () => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, Request>({
    mutationFn: deleteJoinRequest(userData!),
    onSuccess: (data, variables) => {
      queryClient.refetchQueries(["playerStatus", variables.gameId]);
      queryClient.refetchQueries(["games"]);
      queryClient.refetchQueries(["game-players", variables.gameId]);
      queryClient.refetchQueries(["updates", variables.gameId]);
    },
  });
};
