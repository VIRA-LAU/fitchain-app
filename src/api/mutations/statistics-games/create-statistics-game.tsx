import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { CourtType, GameType } from "src/enum-types";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";
import { AxiosError } from "axios";

type Request = {
  type: GameType;
  startTime: string;
  endTime: string;
  courtType: CourtType;
};

const createStatisticsGame = (userId?: number) => async (data: Request) => {
  if (userId)
    return await client
      .post(`/statistics-games/${userId}`, data)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("create-statistics-game-mutation", e?.response.data);
        throw e;
      });
};

export const useCreateStatisticsGameMutation = (userId?: number) => {
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();
  return useMutation<unknown, AxiosError<{ message: string }>, Request>({
    mutationFn: createStatisticsGame(userId),
    onSuccess: () => {
      queryClient.refetchQueries(["statistics-games"]);
      navigation.pop(3);
      navigation.push("StatisticsGames");
    },
  });
};
