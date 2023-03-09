import { useContext } from "react";
import { useQuery } from "react-query";
import { User } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getUserDetails = (userData: UserData) => async () => {
  const header = getHeader(userData);

  return await client
    .get(`/users/me`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("user-details-query", e);
      throw new Error(e);
    });
};

export const useUserDetailsQuery = () => {
  const { userData } = useContext(UserContext);
  return useQuery<User>("user-details", getUserDetails(userData!));
};
