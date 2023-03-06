import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../../client";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";

const updateUser = async (data: any) => {
  return await client.patch(`/users/${data.id}`, data).then((res) => res.data);
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const { setUserData } = useContext(UserContext);
  return useMutation({
    mutationFn: updateUser,
    // onSuccess: async (data) => {
    //   queryClient.refetchQueries(["userDetails", userId]);
    // setUserData((oldData) => ({
    //   ...oldData,
    //   firstName: data.firstName,
    //   lastName: data.lastName,
    // }));
    // const storedAuthentication = JSON.parse(
    //   await AsyncStorage.getItem("authentication")
    // );
    // await AsyncStorage.setItem(
    //   "authentication",
    //   JSON.stringify({
    //     token: storedAuthentication.token,
    //     userId: userId,
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //   })
    // );
    // },
  });
};
