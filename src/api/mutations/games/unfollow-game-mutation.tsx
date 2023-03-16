import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";

type Request = {
  gameId: number;
};

const unfollowGame = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .delete(`/games/followed?gameId=${data.gameId}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("unfollow-game-mutation", e);
      throw new Error(e);
    });
};

export const useUnfollowGameMutation = (
  setFollowDisabled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, Request>({
    mutationFn: unfollowGame(userData!),
    onSuccess: (data) => {
      queryClient.refetchQueries(["followed-games"]);
      setFollowDisabled(false);
    },
    onError: (e) => {
      setFollowDisabled(false);
    },
  });
};
