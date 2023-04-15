import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";

type Request = {
  gameId: number;
};

type Response = {
  id: number;
  gameId: number;
  userId: number;
};

const followGame = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .post("/games/followed", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("follow-game-mutation", e);
      throw new Error(e);
    });
};

export const useFollowGameMutation = () => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();

  return useMutation<Response, unknown, Request>({
    mutationFn: followGame(userData!),
    onSuccess: () => {
      queryClient.refetchQueries(["followed-games"]);
    },
  });
};
