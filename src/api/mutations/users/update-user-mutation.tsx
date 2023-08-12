import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";
import { User } from "src/types";
import { useContext } from "react";

type Request =
  | {
      description?: string;
      height?: number;
      width?: number;
    }
  | FormData;

const updateUser = async (data: Request) => {
  const headers = {
    "Content-Type":
      data instanceof FormData ? "multipart/form-data" : "application/json",
  };
  return await client
    .patch("/users", data, {
      headers,
    })
    .then((res) => res?.data)
    .catch((e) => {
      console.error("update-user-mutation", e);
      throw e;
    });
};

export const useUpdateUserMutation = () => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<User, unknown, Request>({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.refetchQueries(["user-details", userData?.userId]);
    },
    retry: 4,
  });
};
