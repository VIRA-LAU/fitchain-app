import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserData } from "../../../utils/UserContext";

type Props = {};

const createGame = (userData: UserData) => async (data: Props) => {
  const header = getHeader(userData);
  return await client
    .post("/game", {
      ...header,
      data,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("create-game-mutation", e);
      throw new Error(e);
    });
};

export const useCreateGameMutation = (userData: UserData) => {
  return useMutation<unknown, unknown, Props>({
    mutationFn: createGame(userData),
  });
};
