import client from "../../client";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { useNavigation } from "@react-navigation/native";
import { SignUpStackParamList } from "src/navigation";
import { getExpoPushTokenAsync } from "expo-notifications";
import { StackNavigationProp } from "@react-navigation/stack";

type Request = {
  location: string;
  latitude: number;
  longitude: number;
  venueName: string;
  email: string;
  description: string;
  managerFirstName: string;
  managerLastName: string;
  password: string;
  notificationsToken?: string;
};

const createBranch = async (data: Request) => {
  return await client
    .post("/auth/signup/branch", data)
    .then((res) => res?.data)
    .catch((error) => {
      console.error("branch-signup-mutation", error);
      console.error(error.response?.data);
      throw error;
    });
};

export const useCreateBranchMutation = () => {
  const navigation = useNavigation<StackNavigationProp<SignUpStackParamList>>();
  return useMutation<number, AxiosError<{ message: string }>, Request>({
    mutationFn: createBranch,
    onSuccess: async (data, variables) => {
      navigation.replace("VerifyEmail", {
        isBranch: true,
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
