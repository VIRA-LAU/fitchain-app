import client from "../../client";
import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/utils";

type Request = {
  userId: number;
  isBranch: boolean;
};

const signout = async (data: Request) => {
  return await client
    .patch("/auth/signout", data)
    .then((res) => res?.data)
    .catch((error) => {
      console.error("signout-mutation", error?.response?.data);
      throw error;
    });
};

export const useSignoutMutation = () => {
  const { setUserData, setBranchData } = useContext(UserContext);
  return useMutation<unknown, unknown, Request>({
    mutationFn: signout,
    onSuccess: async (data, variables) => {
      if (variables.isBranch) setBranchData(null);
      else setUserData(null);
    },
  });
};
