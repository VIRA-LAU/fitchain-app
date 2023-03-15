import { useContext } from "react";
import { useQuery } from "react-query";
import { GameRequest } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getReceivedRequests = (userData: UserData) => async () => {
  const header = getHeader(userData);
  return await client
    .get("/gamerequests/received", header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("received-requests-query", e);
      throw new Error(e);
    });
};

export const useReceivedRequestsQuery = () => {
  const { userData } = useContext(UserContext);
  return useQuery<GameRequest[]>(
    "received-requests",
    getReceivedRequests(userData!),
    {
      select: (requests) =>
        requests.map((request) => {
          request.game.date = new Date(request.game.date);
          request.game.createdAt = new Date(request.game.createdAt);
          return request;
        }),
    }
  );
};
