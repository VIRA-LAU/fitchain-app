import { useQuery } from "react-query";
import { GameRequest } from "src/types";
import client from "../../client";

const getReceivedRequests = async () => {
  return await client
    .get("/gamerequests/received")
    .then((res) => res?.data)
    .catch((e) => {
      console.error("received-requests-query", e);
      throw new Error(e);
    });
};

export const useReceivedRequestsQuery = () => {
  return useQuery<GameRequest[]>("received-requests", getReceivedRequests, {
    select: (requests) =>
      requests.map((request) => {
        request.game.date = new Date(request.game.date);
        request.game.createdAt = new Date(request.game.createdAt);
        return request;
      }),
  });
};
