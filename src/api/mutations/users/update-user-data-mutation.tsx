import client, { getHeader } from "../../client";
import { useMutation } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { User } from "src/types";
import { useContext } from "react";

type Request = {
  description?: string;
  height?: number;
  width?: number;
};

const updateUserData = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .patch("/users", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("update-user-mutation", e);
      throw new Error(e);
    });
};

export const useUpdateUserDataMutation = (
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { userData } = useContext(UserContext);
  return useMutation<User, unknown, Request>({
    mutationFn: updateUserData(userData!),
    onSuccess: (data) => {
      setSignedIn(true);
    },
  });
};
