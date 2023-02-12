import client from "../../client";
import { useContext } from "react";
import { useMutation } from "react-query";

const createUser = async (data: object) => {
  return await client.post("/authentication/register", data).then((res) => {
    res.data;
    console.log("eh");
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
