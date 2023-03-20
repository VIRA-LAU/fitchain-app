import client from "../../client";
import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "src/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SignUpStackParamList } from "src/navigation";

type Request = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
};

const createUser = async (data: Request) => {
  return await client
    .post("/auth/signup", data)
    .then((res) => res.data)
    .catch((error) => {
      console.error("signup-mutation", error);
      throw error;
    });
};

export const useCreateUserMutation = () => {
  const { setUserData } = useContext(UserContext);
  const navigation = useNavigation<NavigationProp<SignUpStackParamList>>();
  return useMutation<User, unknown, Request>({
    mutationFn: createUser,
    onSuccess: async (data) => {
      let fetchedInfo = {
        userId: data.userId!,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        token: data.access_token,
      };
      setUserData(fetchedInfo);
      navigation.navigate("SignUpWithNumberExtraDetails");
    },
  });
};
