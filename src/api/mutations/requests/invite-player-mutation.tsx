import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { Dispatch, SetStateAction } from "react";

type Request = {
  gameId: number;
  friendId: number;
  team: "HOME" | "AWAY";
};

type Response = {
  id: number;
  friendId: number;
  gameId: number;
  team: "HOME" | "AWAY";
  status: string;
};

const invitePlayer = async (data: Request) => {
  return await client
    .post("/invitations", data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("invite-player-mutation", e);
      throw new Error(e);
    });
};

export const useInvitePlayerMutation = (
  setLoadingIndex: Dispatch<SetStateAction<number | null>>
) => {
  const queryClient = useQueryClient();

  return useMutation<Response, unknown, Request>({
    mutationFn: invitePlayer,
    onMutate: (variables) => {
      setLoadingIndex(variables.friendId);
    },
    onSuccess: (data, variables) => {
      queryClient.refetchQueries(["game-players", variables.gameId]);
      queryClient.refetchQueries(["updates", variables.gameId]);
    },
  });
};
