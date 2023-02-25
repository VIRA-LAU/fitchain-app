import client from "../../client";
import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const createUser = async (data: object) => {
  return await client
    .post("/auth/signup", data)
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const useCreateUserMutation = () => {
  const { userId, setAuthentication } = useContext(UserContext) as any;

  return useMutation({
    mutationFn: createUser,
    onSuccess: async (data: any) => {
      console.log("creating user");
      // setAuthentication((oldAuth: any) => ({
      //   ...oldAuth,
      //   firstName: data.firstName,
      //   lastName: data.lastName,
      // }));
      const storedAuthentication = JSON.parse(
        (await AsyncStorage.getItem("authentication")) as string
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
