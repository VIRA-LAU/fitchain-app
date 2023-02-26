import client from "../../client";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "src/utils";

const LoginUser = async (data: any) => {
  console.log("logging in");
  return await client.post("/auth/signin", data).then((res) => res.data);
};

export default LoginUser;

export const useLoginUserMutation = () => {
  const { userData, setUserData } = useContext(UserContext) as any;
  return useMutation({
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
