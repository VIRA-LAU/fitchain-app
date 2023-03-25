import { useQuery } from "react-query";
import { User } from "src/types";
import { getData, storeData } from "src/utils/AsyncStorage";
import client from "../../client";

const signInQuery = () => async () => {
  return await client
    .get(`/authentication/signin`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => async () => {
      console.error("signin-query", e);
      throw new Error(e);
    });
};

export const useSignInQuery = () => useQuery<User>(["sign-in"], signInQuery());
