import { useQuery } from "react-query";
import { User } from "src/types";
import client from "../../client";

const getUserDetails = (id?: number) => async () => {
  if (id)
    return await client
      .get(`/users/${id}`)
      .then((res) => res?.data)
      .catch((e) => {
        throw new Error(e);
      });
};

export const useUserDetailsQuery = (id?: number) => {
  return useQuery<User>(["user-details", id], getUserDetails(id));
};
