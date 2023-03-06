import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserData } from "../../../utils/UserContext";

type Props = {};

const updateGame = (userData: UserData) => async (data: Props) => {
  const header = getHeader(userData);
  return await client
    .patch("/game/update", {
      ...header,
      data,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("update-game-mutation", e);
      throw new Error(e);
    });
};

export const useUpdateGameMutation = (userData: UserData) => {
  return useMutation<unknown, unknown, Props>({
    mutationFn: updateGame(userData),
  });
};
