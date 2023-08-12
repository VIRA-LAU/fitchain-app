import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";
import { Dispatch, SetStateAction, useContext } from "react";
import { Game } from "src/types";

type Request = {
  homeScore?: number;
  awayScore?: number;
};

const updateGame = (id: number) => async (data: Request) => {
  return await client
    .patch(`/games/${id}`, data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("update-game-mutation", e);
      throw e;
    });
};

export const useUpdateGameMutation = (
  id: number,
  setIsChangingScore?: Dispatch<SetStateAction<boolean>>
) => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<Game, unknown, Request>({
    mutationFn: updateGame(id),
    onSuccess: () => {
      queryClient.refetchQueries(["games", id]);
      queryClient.refetchQueries(["activities", userData?.userId]);
      if (setIsChangingScore) setIsChangingScore(false);
    },
  });
};
