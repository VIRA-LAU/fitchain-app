import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction, useContext } from "react";
import { useQuery } from "react-query";
import { User } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getUserDetails = (userData: UserData) => async () => {
  const header = getHeader(userData);

  return await client
    .get(`/users/me`, header)
    .then((res) => res.data)
    .catch((e) => {
      throw new Error(e);
    });
};

export const useUserDetailsQuery = (
  enabled = true,
  setSignedIn?: Dispatch<SetStateAction<boolean>>,
  setTokenFoundOnOpen?: Dispatch<SetStateAction<boolean>>
) => {
  const { userData } = useContext(UserContext);
  return useQuery<User>("user-details", getUserDetails(userData!), {
    enabled,
    onSuccess: (data) => {
      if (setSignedIn) setSignedIn(true);
    },
    onError: () => {
      AsyncStorage.clear();
      if (setSignedIn) setSignedIn(false);
      if (setTokenFoundOnOpen) setTokenFoundOnOpen(false);
    },
  });
};
