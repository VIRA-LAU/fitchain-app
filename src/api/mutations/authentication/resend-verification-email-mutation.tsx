import client from "../../client";
import { useMutation } from "react-query";

type Request = {
  email: string;
  isBranch: boolean;
};

const resendVerificationEmail = async (data: Request) => {
  return await client
    .patch("/auth/resendVerificationEmail", data)
    .then((res) => res?.data)
    .catch((error) => {
      console.error("resend-email-code-mutation", error?.response?.data);
      throw error;
    });
};

export const useResendVerificationEmailMutation = () => {
  return useMutation<unknown, unknown, Request>({
    mutationFn: resendVerificationEmail,
  });
};
