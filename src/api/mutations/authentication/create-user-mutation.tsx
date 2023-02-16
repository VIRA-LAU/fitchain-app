import client from "../../client";
import { useContext } from "react";
import { useMutation } from "react-query";

const createUser = async (data: object) => {
  console.log("eh");
  return await client.post("/auth/signup", data).then((res) => {
    res.data;
    console.log(res.data);
  });
};

export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: createUser,
    onSuccess: (data: any) => {
      console.log("creating user");
    },
  });
};
