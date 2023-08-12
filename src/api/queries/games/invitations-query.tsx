import { useContext } from "react";
import { useQuery } from "react-query";
import { Invitation } from "src/types";
import { UserContext, UserData } from "src/utils";
import client from "../../client";

const getInvitations = (userData: UserData) => async () => {
  return await client
    .get(`/invitations/received?userId=${userData?.userId}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("invitations-query", e);
      throw e;
    });
};

export const useInvitationsQuery = () => {
  const { userData } = useContext(UserContext);
  return useQuery<Invitation[]>("invitations", getInvitations(userData!), {
    select: (invitations) =>
      invitations.map((invitation) => {
        invitation.game.startTime = new Date(invitation.game.startTime);
        invitation.game.endTime = new Date(invitation.game.endTime);
        invitation.game.createdAt = new Date(invitation.game.createdAt);
        return invitation;
      }),
  });
};
