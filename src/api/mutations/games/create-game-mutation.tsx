import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { GameType } from "src/enum-types";
import { AxiosError } from "axios";

type Request = {
  courtId?: number;
  type: GameType;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

const createGame = async (data: Request) => {
  return await client
    .post("/games", data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("create-game-mutation", e?.response.data);
      throw e;
    });
};

export const useCreateGameMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<{ message: string }>, Request>({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.refetchQueries(["games"]);
      queryClient.refetchQueries(["bookings"]);
    },
    onError: (e) => {
      if (e.response?.data.message === "EXISTING_GAME_OVERLAP")
        queryClient.refetchQueries("search-branches");
    },
  });
};
