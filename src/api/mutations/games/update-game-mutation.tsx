import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { Dispatch, SetStateAction, useContext } from "react";
import { Game } from "src/types";

type Request = {
  homeScore?: number;
  awayScore?: number;
};

const updateGame =
  (userData: UserData, id: number) => async (data: Request) => {
    const header = getHeader(userData);
    return await client
      .patch(`/games/${id}`, data, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("update-game-mutation", e);
        throw new Error(e);
      });
  };

export const useUpdateGameMutation = (
  id: number,
  setIsChangingScore?: Dispatch<SetStateAction<boolean>>
) => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<Game, unknown, Request>({
    mutationFn: updateGame(userData!, id),
    onSuccess: (data) => {
      queryClient.refetchQueries(["games", id]);
      queryClient.refetchQueries("activities");
      if (setIsChangingScore) setIsChangingScore(false);
    },
  });
};
