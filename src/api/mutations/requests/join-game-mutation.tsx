import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";

type Request = {
  gameId: number;
  team: "HOME" | "AWAY";
};

type Response = {
  gameId: number;
  status: string;
  team: string;
};

const joinGame = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .post("/gamerequests", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("join-game-mutation", e);
      throw new Error(e);
    });
};

export const useJoinGameMutation = (
  setJoinDisabled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();

  return useMutation<Response, unknown, Request>({
    mutationFn: joinGame(userData!),
    onSuccess: (data) => {
      setJoinDisabled(true);
      queryClient.setQueryData(["playerStatus", data.gameId], {
        hasRequestedtoJoin: "PENDING",
        hasBeenInvited: false,
        isAdmin: false,
      });
      queryClient.refetchQueries("invitations");
    },
  });
};
