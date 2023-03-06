import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";

type Props = {
  gameId: number;
  team: "HOME" | "AWAY";
};

const joinGame = (userData: UserData) => async (data: Props) => {
  const header = getHeader(userData);
  return await client
    .post("/gamerequests", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("join-game-mutation", e);
      throw new Error(e);
    });
};

export const useJoinGameMutation = (
  setJoinDisabled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { userData } = useContext(UserContext);
  return useMutation<unknown, unknown, Props>({
    mutationFn: joinGame(userData!),
  });
};
