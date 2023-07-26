import client from "../../client";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SignUpStackParamList } from "src/navigation";
import { notificationsToken } from "src/utils/NotificationService";

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
  notificationsToken: string | undefined;
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
  const navigation = useNavigation<NavigationProp<SignUpStackParamList>>();
  return useMutation<number, AxiosError<{ message: string }>, Request>({
    mutationFn: createBranch,
    onSuccess: async (data) => {
      navigation.navigate("VerifyEmail", {
        isBranch: true,
        userId: data,
      });
    },
    onMutate: (variables) => {
      if (notificationsToken) variables.notificationsToken = notificationsToken;
    },
  });
};
