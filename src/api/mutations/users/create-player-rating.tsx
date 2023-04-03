import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";

type Request = {
  performance: number;
  punctuality: number;
  fairplay: number;
  teamPlayer: number;
  gameId: number;
  playerId: number;
};
const createRating = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .post("/users/rate", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("create-game-mutation", e.response.data);
      throw new Error(e.message);
    });
};

export const useCreateRatingMutation = () => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();
  return useMutation<unknown, unknown, Request>({
    mutationFn: createRating(userData!),
    onSuccess: (data, variables) => {
      queryClient.refetchQueries(["game-players", variables.gameId]);
      navigation.goBack();
    },
  });
};
