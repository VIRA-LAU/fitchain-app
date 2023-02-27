import { useQuery } from "react-query";
import { UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getInvitations = (userData: UserData) => async () => {
  const header = getHeader(userData);
  return await client
    .get(`/invitations/received?userId=${userData.userId}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("invitations-query", e);
      throw new Error(e);
    });
};

export const useInvitationsQuery = (userData: UserData) =>
  useQuery(["invitations", userData.userId], getInvitations(userData));
