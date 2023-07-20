import client from "../../client";
import { useMutation } from "react-query";
import { AxiosError } from "axios";

type Request = {
  email: string;
};

const forgotPassword = async (data: Request) => {
  return await client
    .patch("/auth/forgotPassword", data)
    .then((res) => res?.data)
    .catch((error) => {
      console.error("forgot-password-mutation", error?.response?.data);
      throw error;
    });
};

export const useForgotPasswordMutation = () => {
  return useMutation<unknown, AxiosError<{ message: string }>, Request>({
    mutationFn: forgotPassword,
  });
};
