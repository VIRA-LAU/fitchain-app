import { useQuery } from "react-query";
import { Invitation } from "src/types";
import { UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getInvitations = (userData: UserData) => async () => {
  const header = getHeader(userData);
  return await client
    .get(`/invitations/received?userId=${userData?.userId}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("invitations-query", e);
      throw new Error(e);
    });
};

export const useInvitationsQuery = (userData: UserData) =>
  useQuery<Invitation[]>(
    ["invitations", userData?.userId],
    getInvitations(userData),
    {
      select: (invitations) =>
        invitations.map((invitation) => {
          invitation.game.date = new Date(invitation.game.date);
          return invitation;
        }),
    }
  );
