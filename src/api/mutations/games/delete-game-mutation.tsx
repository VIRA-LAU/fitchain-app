import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserData } from "../../../utils/UserContext";

type Props = {};

const deleteGame = (userData: UserData) => async (data: Props) => {
  const header = getHeader(userData);
  return await client
    .delete("/game/", {
      ...header,
      data,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("delete-game-mutation", e);
      throw new Error(e);
    });
};

export const useDeleteGameMutation = (userData: UserData) => {
  return useMutation<unknown, unknown, Props>({
    mutationFn: deleteGame(userData),
  });
};
