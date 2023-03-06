import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserData } from "../../../utils/UserContext";

type Props = {};

const updateUser = (userData: UserData) => async (data: Props) => {
  const header = getHeader(userData);
  return await client
    .patch("/user/update", {
      ...header,
      data,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("update-user-mutation", e);
      throw new Error(e);
    });
};

export const useUpdateUserMutation = (userData: UserData) => {
  return useMutation<unknown, unknown, Props>({
    mutationFn: updateUser(userData),
  });
};
