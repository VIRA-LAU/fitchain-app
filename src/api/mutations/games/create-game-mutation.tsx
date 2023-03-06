import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";

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

export const useCreateGameMutation = () => {
  const { userData } = useContext(UserContext);
  return useMutation<unknown, unknown, Props>({
    mutationFn: createGame(userData!),
  });
};
