import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";
import { Invitation } from "src/types";

type Request = {
  invitationId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  gameId: number;
};

const respondToInvite = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .patch(`/invitations/${data.invitationId}`, { status: data.status }, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("respond-to-invite-mutation", e);
      throw new Error(e);
    });
};

export const useRespondToInviteMutation = (
  setJoinDisabled?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();

  return useMutation<Invitation, unknown, Request>({
    mutationFn: respondToInvite(userData!),
    onSuccess: (data, variables) => {
      if (setJoinDisabled) setJoinDisabled(false);
      queryClient.refetchQueries("invitations");
      queryClient.refetchQueries(["playerStatus", variables.gameId]);
      queryClient.refetchQueries(["game-players", variables.gameId]);
      queryClient.refetchQueries(["updates", variables.gameId]);
    },
    onError: () => {
      if (setJoinDisabled) setJoinDisabled(false);
    },
  });
};
