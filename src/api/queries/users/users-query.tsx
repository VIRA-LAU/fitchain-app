import { useQuery } from "react-query";
import client from "../../client";
import { useContext } from "react";
import { UserContext } from "src/utils";

type Response = {
  id: number;
  firstName: string;
  lastName: string;
  rating: number;
  profilePhotoUrl: string;
};

const getUsers = async () => {
  return await client
    .get(`/users`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("users-query", e);
      throw e;
    });
};

export const useUsersQuery = () => {
  const { userData } = useContext(UserContext);
  return useQuery<Response[]>("users", getUsers, {
    select: (data) => data.filter((user) => user.id !== userData!.userId),
  });
};
