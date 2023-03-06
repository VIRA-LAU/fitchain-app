import client from "../../client";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "src/utils";
import { User } from "src/types";

type Props = {
  email: string;
  password: string;
};

const LoginUser = async (data: Props) => {
  return await client.post("/auth/signin", data).then((res) => res.data);
};

export const useLoginUserMutation = (
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { setUserData } = useContext(UserContext) as any;
  return useMutation<User, unknown, Props>({
    mutationFn: LoginUser,
    onSuccess: async (data) => {
      console.log(data);
      let fetchedInfo = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        token: data.access_token,
      };
      setUserData(fetchedInfo);
      setSignedIn(true);
      //   client.interceptors.request.use(
      //   async (config) => {
      //     const { userData, setUserData } = useContext(UserContext) as any;
      //     const token = userData?.token;
      //     if (token) {
      //       config.headers.Authorization = `Bearer ${token}`;
      //     }
      //     return config;
      //   },
      //   (error) => {
      //     return Promise.reject(error);
      //   }
      // );
    },
  });
};
