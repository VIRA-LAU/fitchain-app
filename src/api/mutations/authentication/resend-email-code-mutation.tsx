import client from "../../client";
import { useMutation } from "react-query";

type Request = {
  userId: number;
  isBranch: boolean;
};

const resendEmailCode = async (data: Request) => {
  return await client
    .patch("/auth/resendEmailCode", data)
    .then((res) => res?.data)
    .catch((error) => {
      console.error("resend-email-code-mutation", error?.response?.data);
      throw error;
    });
};

export const useResendEmailCodeMutation = () => {
  return useMutation<unknown, unknown, Request>({
    mutationFn: resendEmailCode,
  });
};
