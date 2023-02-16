import client from "../../client";
import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const createUser = async (data: object) => {
  console.log("eh");
  return await client.post("/auth/signup", data).then((res) => {
    res.data;
    console.log(res.data);
  });
};

export const useCreateUserMutation = () => {
  const { userId, setAuthentication } = useContext(UserContext);

  return useMutation({
    mutationFn: createUser,
    onSuccess: async (data: any) => {
      console.log("creating user");
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
