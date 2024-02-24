import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { Game } from "src/types";

type Request = {
  recordingMode: "start" | "stop";
};

const startStopRecording = (gameId?: number) => async (data: Request) => {
  if (gameId)
    return await client
      .patch(`/games/recording/${gameId}`, data)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("start-stop-recording-mutation", e);
        throw e;
      });
};

export const useStartStopRecording = (gameId?: number) => {
  const queryClient = useQueryClient();
  return useMutation<Game, unknown, Request>({
    mutationFn: startStopRecording(gameId),
    onSuccess: () => {
      queryClient.refetchQueries(["game", gameId]);
    },
  });
};
