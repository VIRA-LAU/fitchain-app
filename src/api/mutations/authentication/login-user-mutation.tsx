import client from "../../client";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "src/utils";
import { User } from "src/types";
import { getData, storeData } from "src/utils/AsyncStorage";

type Request = {
  email: string;
  password: string;
};

const LoginUser = async (data: Request) => {
  return await client.post("/auth/signin", data).then((res) => res.data);
};

export const useLoginUserMutation = (
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { setUserData } = useContext(UserContext) as any;
  return useMutation<User, unknown, Request>({
    mutationFn: LoginUser,
    onSuccess: async (data) => {
      console.log(data);
      let fetchedInfo = {
        userId: data.userId!,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        token: data.access_token,
      };
      setUserData(fetchedInfo);
      setSignedIn(true);
      const keys = ["userId", "firstName", "lastName", "email", "token"];
      const values = [
        data.userId,
        data.firstName,
        data.lastName,
        data.email,
        data.access_token,
      ];
      storeData(keys, values);
    },
  });
};
