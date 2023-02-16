import { useQuery } from "react-query";
import client from "../../client";

const signInQuery = () => async () => {
  return await client
    .get(`/authentication/signin`)
    .then((res) => res.data)
    .catch((e) => {
      console.error("signin-query", e);
      throw new Error(e);
    });
};

export const useSignInQuery = () => useQuery(["sign-in"], signInQuery());
