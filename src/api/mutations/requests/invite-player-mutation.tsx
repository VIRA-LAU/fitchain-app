import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { Dispatch, SetStateAction, useContext } from "react";

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

const invitePlayer = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .post("/invitations", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("invite-player-mutation", e);
      throw new Error(e);
    });
};

export const useInvitePlayerMutation = (
  setLoadingIndex: Dispatch<SetStateAction<number | null>>
) => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();

  return useMutation<Response, unknown, Request>({
    mutationFn: invitePlayer(userData!),
    onMutate: (variables) => {
      setLoadingIndex(variables.friendId);
    },
    onSuccess: (data, variables) => {
      queryClient.refetchQueries(["game-players", variables.gameId]);
      queryClient.refetchQueries(["updates", variables.gameId]);
    },
  });
};
