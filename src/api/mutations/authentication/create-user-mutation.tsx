import client from "../../client";
import { useMutation } from "react-query";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SignUpStackParamList } from "src/navigation";
import { AxiosError } from "axios";

type Request = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
  const navigation = useNavigation<NavigationProp<SignUpStackParamList>>();
  return useMutation<number, AxiosError<{ message: string }>, Request>({
    mutationFn: createUser,
    onSuccess: async (data) => {
      navigation.navigate("VerifyEmail", {
        isBranch: false,
        userId: data,
      });
    },
  });
};
