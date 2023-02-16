import client from "../../client";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";

const updateGame = async (data: any) => {
  return await client
    .patch(`/update/${data.id}`, data.content)
    .then((res) => res.data);
};

export const useUpdateGameMutation = () => {
  const queryClient = useQueryClient();
  const { userId } = useContext(UserContext);
  return useMutation({
    mutationFn: updateGame,
    onSuccess: (data) => {
      queryClient.refetchQueries(["games"]);
    },
  });
};
