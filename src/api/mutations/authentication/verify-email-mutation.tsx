import client, { setHeaderAndInterceptors } from "../../client";
import { useMutation } from "react-query";
import { User } from "src/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SignUpStackParamList } from "src/navigation";
import { storeData } from "src/utils/AsyncStorage";
import { AxiosError } from "axios";
import { useContext } from "react";
import { UserContext } from "src/utils";

type Request = {
  userId: number;
  code: string;
};

const verifyEmail = async (data: Request) => {
  return await client
    .patch("/auth/verifyEmail/user", data)
    .then((res) => res?.data)
    .catch((error) => {
      console.error("verify-email-mutation", error?.response?.data);
      throw error;
    });
};

export const useVerifyEmailMutation = () => {
  const navigation = useNavigation<NavigationProp<SignUpStackParamList>>();
  const { setUserData, setBranchData } = useContext(UserContext);
  return useMutation<
    User & {
      userId: number;
      access_token: string;
    },
    AxiosError<{ message: string }>,
    Request
  >({
    mutationFn: verifyEmail,
    onSuccess: async (data) => {
      let fetchedInfo = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        token: data.access_token,
      };
      const keys = [
        "isBranch",
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
      setHeaderAndInterceptors({
        userData: fetchedInfo,
        setUserData,
        setBranchData,
      });
      navigation.navigate("SignUpExtraDetails", { userData: fetchedInfo });
    },
  });
};
