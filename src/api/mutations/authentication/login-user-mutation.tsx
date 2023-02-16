import client from "../../client";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

const LoginUser = async (data: any) => {
  console.log("login");
  return await client
    .post("/auth/signin", data)
    .then((res) => res.data);
};

export const useLoginUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LoginUser,
    onSuccess: (data) => {
      //   queryClient.refetchQueries(["student", { ID: userId }]);
    },
  });
};
