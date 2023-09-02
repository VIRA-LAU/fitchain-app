import client from "../../client";
import { useMutation } from "react-query";

type Request = FormData;

const uploadGameVideo = (gameId?: number) => async (data: Request) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  if (gameId)
    return await client
      .patch(`/games/uploadVideo/${gameId}`, data, { headers })
      .then((res) => res?.data)
      .catch((e) => {
        console.error("upload-game-video-mutation", e);
        throw e;
      });
};

export const useUploadGameVideoMutation = (gameId?: number) => {
  return useMutation<unknown, unknown, Request>({
    mutationFn: uploadGameVideo(gameId),
  });
};
