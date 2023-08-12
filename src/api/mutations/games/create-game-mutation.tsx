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
import { AxiosError } from "axios";

type Request = {
  courtId: number;
  type: GameType;
  startTime: string;
  endTime: string;
};

const createGame = async (data: Request) => {
  return await client
    .post("/games", data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("create-game-mutation", e?.response.data);
      throw e;
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
  return useMutation<unknown, AxiosError<{ message: string }>, Request>({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.refetchQueries(["games"]);
      queryClient.refetchQueries(["bookings"]);
      navigation.pop(4);
      navigation.navigate("Home");
    },
    onError: (e) => {
      if (e.response?.data.message === "EXISTING_GAME_OVERLAP")
        queryClient.refetchQueries("search-branches");
    },
  });
};
