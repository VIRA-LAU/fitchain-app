import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { Invitation } from "src/types";

type Request = {
  invitationId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  gameId: number;
};

const respondToInvite = async (data: Request) => {
  return await client
    .patch(`/invitations/${data.invitationId}`, { status: data.status })
    .then((res) => res?.data)
    .catch((e) => {
      console.error("respond-to-invite-mutation", e);
      throw e;
    });
};

export const useRespondToInviteMutation = (
  setJoinDisabled?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();

  return useMutation<Invitation, unknown, Request>({
    mutationFn: respondToInvite,
    onSuccess: (data, variables) => {
      if (setJoinDisabled) setJoinDisabled(false);
      queryClient.refetchQueries("invitations");
      queryClient.refetchQueries(["game", variables.gameId]);
      queryClient.refetchQueries(["games"]);
      queryClient.refetchQueries(["playerStatus", variables.gameId]);
      queryClient.refetchQueries(["game-players", variables.gameId]);
      queryClient.refetchQueries(["updates", variables.gameId]);
    },
    onError: () => {
      if (setJoinDisabled) setJoinDisabled(false);
    },
  });
};
