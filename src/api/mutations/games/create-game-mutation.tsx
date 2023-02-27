import { useAxios } from "../../client";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";

const createGame = async (data: any) => {
  const client = useAxios();
  return await client.post("/game", data).then((res) => res.data);
};

export const useCreateGameMutation = () => {
  const queryClient = useQueryClient();
  const { userData } = useContext(UserContext);
  return useMutation({
    mutationFn: createGame,
    onSuccess: (data) => {
      queryClient.refetchQueries(["games"]);
    },
  });
};
