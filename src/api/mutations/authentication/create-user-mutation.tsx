import client from "../../client";
import { useMutation } from "react-query";
import { useNavigation } from "@react-navigation/native";
import { SignUpStackParamList } from "src/navigation";
import { AxiosError } from "axios";
import { getExpoPushTokenAsync } from "expo-notifications";
import { StackNavigationProp } from "@react-navigation/stack";

type Request = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  notificationsToken?: string;
};

const createUser = async (data: Request) => {
  return await client
    .post("/auth/signup/user", data)
    .then((res) => res?.data)
    .catch((error) => {
      console.error("signup-mutation", error?.response?.data);
      throw error;
    });
};

export const useCreateUserMutation = () => {
  const navigation = useNavigation<StackNavigationProp<SignUpStackParamList>>();
  return useMutation<number, AxiosError<{ message: string }>, Request>({
    mutationFn: createUser,
    onSuccess: async (data, variables) => {
      navigation.replace("VerifyEmail", {
        isBranch: false,
        email: variables.email,
        password: variables.password,
      });
    },
    onMutate: async (variables) => {
      const notificationsToken = (await getExpoPushTokenAsync()).data;
      if (notificationsToken) variables.notificationsToken = notificationsToken;
    },
  });
};
