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
export default createUser;
export const useCreateUserMutation = () => {
  const { setUserData } = useContext(UserContext);

  return useMutation({
    mutationFn: createUser,
    onSuccess: async (data) => {
      console.log("creating user");
      let fetchedInfo = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        token: data.access_token,
      };
      setUserData(fetchedInfo);
    },
  });
};
