import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { GameType } from "src/types";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList, StackParamList } from "src/navigation";

type Request = {
  courtId: number;
  date: string;
  type: GameType;
  startTime: number;
  endTime: number;
};

const createGame = async (data: Request) => {
  return await client
    .post("/games", data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("create-game-mutation", e);
      throw new Error(e);
    });
};

export const useCreateGameMutation = () => {
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<StackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();
  return useMutation<unknown, unknown, Request>({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.refetchQueries(["games"]);
      queryClient.refetchQueries(["bookings"]);
      navigation.pop(4);
      navigation.navigate("Home");
    },
    onMutate: (variables) => {
      variables.date = JSON.stringify(
        new Date(
          new Date(variables.date).setHours(
            Math.floor(variables.startTime / 60),
            variables.startTime % 60,
            0
          )
        )
      );
    },
  });
};
