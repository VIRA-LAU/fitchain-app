import { useQuery } from "react-query";
import client from "../../client";

const getInvitations = (userId: number) => async () => {
  return await client
    .get(`/games/invitations?userId=${userId}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error("invitations-query", e);
      throw new Error(e);
    });
};

export const useInvitationsQuery = (userId: number) =>
  useQuery(["invitations", userId], getInvitations(userId));
