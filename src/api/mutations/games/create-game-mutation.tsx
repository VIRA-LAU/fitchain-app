import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";

type Request = {
  courtId: number;
  date: Date;
  duration: number;
};

const createGame = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .post("/games/bookings", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("create-game-mutation", e.response.data);
      throw new Error(e);
    });
};

export const useCreateGameMutation = () => {
  const { userData } = useContext(UserContext);
  return useMutation<unknown, unknown, Request>({
    mutationFn: createGame(userData!),
  });
};
