import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";
import { Game } from "src/types";

type Request = {
  recordingMode: "start" | "stop";
};

const startStopRecording =
  (userData: UserData, gameId: number) => async (data: Request) => {
    const header = getHeader(userData);
    return await client
      .patch(`/games/recording/${gameId}`, data, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("start-stop-recording-mutation", e);
        throw new Error(e);
      });
  };

export const useStartStopRecording = (gameId: number) => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<Game, unknown, Request>({
    mutationFn: startStopRecording(userData!, gameId),
    onSuccess: () => {
      queryClient.refetchQueries(["games", gameId]);
    },
  });
};
