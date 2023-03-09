import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";

type Request = {};

const deleteGame = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .delete("/game/", header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("delete-game-mutation", e);
      throw new Error(e);
    });
};

export const useDeleteGameMutation = () => {
  const { userData } = useContext(UserContext);
  return useMutation<unknown, unknown, Request>({
    mutationFn: deleteGame(userData!),
  });
};
