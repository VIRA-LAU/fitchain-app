import { useContext } from "react";
import { useQuery } from "react-query";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

type Response = {
  id: number;
  firstName: string;
  lastName: string;
  rating: number;
  profilePhotoUrl: string;
};

const getUsers = (userData: UserData) => async () => {
  const header = getHeader(userData);

  return await client
    .get(`/users`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("users-query", e);
      throw new Error(e);
    });
};

export const useUsersQuery = () => {
  const { userData } = useContext(UserContext);
  return useQuery<Response[]>("users", getUsers(userData!), {
    select: (data) => data.filter((user) => user.id !== userData!.userId),
  });
};
