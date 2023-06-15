import client from "../../client";
import { useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/utils";
import { User } from "src/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SignUpStackParamList } from "src/navigation";
import { storeData } from "src/utils/AsyncStorage";
import { AxiosError } from "axios";

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
      console.error("signup-mutation", error?.response?.data);
      throw error;
    });
};

export const useCreateUserMutation = () => {
  const { setUserData } = useContext(UserContext);
  const navigation = useNavigation<NavigationProp<SignUpStackParamList>>();
  return useMutation<
    User & {
      userId: number;
      access_token: string;
    },
    AxiosError<{ message: string }>,
    Request
  >({
    mutationFn: createUser,
    onSuccess: async (data) => {
      let fetchedInfo = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        token: data.access_token,
      };
      setUserData(fetchedInfo);
      const keys = [
        "isVenue",
        "userId",
        "firstName",
        "lastName",
        "email",
        "token",
      ];
      const values = [
        false,
        data.userId,
        data.firstName,
        data.lastName,
        data.email,
        data.access_token,
      ];
      storeData(keys, values);
      navigation.navigate("SignUpWithNumberExtraDetails");
    },
  });
};
