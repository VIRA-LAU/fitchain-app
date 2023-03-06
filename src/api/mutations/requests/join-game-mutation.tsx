import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserData } from "../../../utils/UserContext";

type Props = {
  gameId: number;
  team: "HOME" | "AWAY";
};

const joinGame = (userData: UserData) => async (data: Props) => {
  const header = getHeader(userData);
  return await client
    .post("/gamerequests", {
      ...header,
      data,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("join-game-mutation", e);
      throw new Error(e);
    });
};

export const useJoinGameMutation = (userData: UserData) => {
  return useMutation<unknown, unknown, Props>({
    mutationFn: joinGame(userData),
  });
};
