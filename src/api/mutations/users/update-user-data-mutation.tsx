import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { User } from "src/types";
import { useContext } from "react";

type Request =
  | {
      description?: string;
      height?: number;
      width?: number;
    }
  | FormData;

const updateUserData = (userData: UserData) => async (data: Request) => {
  const authHeader = getHeader(userData);
  const headers = {
    ...authHeader.headers,
    "Content-Type":
      data instanceof FormData ? "multipart/form-data" : "application/json",
  };
  return await client
    .patch("/users", data, {
      headers,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("update-user-mutation", e);
      throw new Error(e);
    });
};

export const useUpdateUserDataMutation = (
  setSignedIn?: React.Dispatch<React.SetStateAction<"player" | "venue" | null>>
) => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<User, unknown, Request>({
    mutationFn: updateUserData(userData!),
    onSuccess: () => {
      if (setSignedIn) setSignedIn("player");
      queryClient.refetchQueries(["user-details", userData?.userId]);
    },
  });
};
