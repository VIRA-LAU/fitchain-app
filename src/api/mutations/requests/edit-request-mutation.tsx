import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";
import { GameRequest } from "src/types";

type Request = {
  requestId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  gameId: number;
};

const editJoinRequest = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .patch(`/gamerequests/${data.requestId}`, { status: data.status }, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("edit-join-request-mutation", e);
      throw new Error(e);
    });
};

export const useEditJoinRequestMutation = () => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();

  return useMutation<GameRequest, unknown, Request>({
    mutationFn: editJoinRequest(userData!),
    onSuccess: (data, variables) => {
      queryClient.refetchQueries("received-requests");
      queryClient.refetchQueries(["game-players", variables.gameId]);
      queryClient.refetchQueries(["updates", variables.gameId]);
    },
  });
};
