import { useQuery } from "react-query";
import { useAxios } from "../../client";

const getInvitations = (userId: number) => async () => {
  const client = useAxios();
  console.log("we are in invitations");
  console.log(userId);
  return await client
    .get(`/invitations?userId=${userId}`)
    .then((res) => {
      res.data;
      console.log(res.data);
    })
    .catch((e) => {
      console.error("invitations-query", e);
      throw new Error(e);
    });
};

export const useInvitationsQuery = (userId: number) =>
  useQuery(["invitations", userId], getInvitations(userId));
