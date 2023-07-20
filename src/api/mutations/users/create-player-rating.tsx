import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList, StackParamList } from "src/navigation";

type Request = {
  performance: number;
  punctuality: number;
  fairplay: number;
  teamPlayer: number;
  gameId: number;
  playerId: number;
};
const createRating = async (data: Request) => {
  return await client
    .post("/users/rate", data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("create-game-mutation", e.response.data);
      throw new Error(e.message);
    });
};

export const useCreateRatingMutation = () => {
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<StackParamList>,
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
