import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction, useContext } from "react";
import { useQuery } from "react-query";
import { User } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getUserDetails = (userData: UserData, id?: number) => async () => {
  const header = getHeader(userData);
  if (id)
    return await client
      .get(`/users/${id}`, header)
      .then((res) => res.data)
      .catch((e) => {
        throw new Error(e);
      });
};

export const useUserDetailsQuery = (
  id?: number,
  enabled = true,
  setSignedIn?: Dispatch<SetStateAction<"player" | "venue" | null>>,
  setTokenFoundOnOpen?: Dispatch<SetStateAction<boolean>>
) => {
  const { userData } = useContext(UserContext);
  return useQuery<User>(["user-details", id], getUserDetails(userData!, id), {
    enabled,
    onSuccess: (data) => {
      if (setSignedIn) setSignedIn("player");
    },
    onError: () => {
      if (setSignedIn) {
        AsyncStorage.clear();
        setSignedIn(null);
      }
      if (setTokenFoundOnOpen) setTokenFoundOnOpen(false);
    },
  });
};
