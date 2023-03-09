import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";

type Request = {};

const updateGame = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .patch("/game/update", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("update-game-mutation", e);
      throw new Error(e);
    });
};

export const useUpdateGameMutation = () => {
  const { userData } = useContext(UserContext);
  return useMutation<unknown, unknown, Request>({
    mutationFn: updateGame(userData!),
  });
};
