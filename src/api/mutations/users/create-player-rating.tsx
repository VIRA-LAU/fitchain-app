import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";

type Request = {
  defense: number;
  offense: number;
  general: number;
  skill: number;
  teamplay: number;
  punctuality: number;
  gameId: number;
  playerId: number;
};
const createRating = async (data: Request) => {
  return await client
    .post("/users/rate", data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("create-rating-mutation", e.response.data);
      throw e;
    });
};

export const useCreateRatingMutation = () => {
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();
  return useMutation<unknown, unknown, Request>({
    mutationFn: createRating,
    onSuccess: (data, variables) => {
      queryClient.refetchQueries(["game-players", variables.gameId]);
      navigation.goBack();
    },
  });
};
