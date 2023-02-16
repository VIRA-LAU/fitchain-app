import client from "../../client";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "src/utils";

const LoginUser = async (data: any) => {
  console.log("login");
  return await client
    .post("/auth/signin", data)
    .then((res) => res.data);
};

export const useLoginUserMutation = () => {
  const { userId, setAuthentication } = useContext(UserContext);
  return useMutation({
    mutationFn: LoginUser,
    onSuccess: async (data) => {
      setAuthentication((oldAuth: any) => ({
        ...oldAuth,
        firstName: data.firstName,
        lastName: data.lastName,
      }));
      const storedAuthentication = JSON.parse(
        await AsyncStorage.getItem("authentication")
      );
      await AsyncStorage.setItem(
        "authentication",
        JSON.stringify({
          token: storedAuthentication.token,
          userId: userId,
          firstName: data.firstName,
          lastName: data.lastName,
        })
      );
    },
  });
};
