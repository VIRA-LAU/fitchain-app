import client from "../../client";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";

const createGame = async (data: any) => {
  return await client.post("/game", data).then((res) => res.data);
};

export const useCreateGameMutation = () => {
  const queryClient = useQueryClient();
  const { userId } = useContext(UserContext);
  return useMutation({
    mutationFn: createGame,
    onSuccess: (data) => {
      queryClient.refetchQueries(["games"]);
    },
  });
};
