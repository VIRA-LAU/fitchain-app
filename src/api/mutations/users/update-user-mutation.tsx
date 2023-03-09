import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserData } from "../../../utils/UserContext";

type Request = {};

const updateUser = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .patch("/user/update", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("update-user-mutation", e);
      throw new Error(e);
    });
};

export const useUpdateUserMutation = (userData: UserData) => {
  return useMutation<unknown, unknown, Request>({
    mutationFn: updateUser(userData),
  });
};
