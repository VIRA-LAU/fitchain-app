import client from "../../client";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";

const deleteGame = async (rideId: number) => {
  return await client.delete(`/games/${rideId}`).then((res) => res.data);
};

export const useDeleteGameMutation = () => {
  const queryClient = useQueryClient();
  const { userId } = useContext(UserContext);
  return useMutation({
    mutationFn: deleteGame,
    onSuccess: (data) => {
      queryClient.refetchQueries(["games"]);
    },
  });
};
