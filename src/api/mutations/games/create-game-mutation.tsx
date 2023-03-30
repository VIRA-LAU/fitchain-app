import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";
import { GameType } from "src/types";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";

type Request = {
  courtId: number;
  date: Date;
  timeSlotIds: number[];
  type: GameType;
};

const createGame = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .post("/games/bookings", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("create-game-mutation", e);
      throw new Error(e);
    });
};

export const useCreateGameMutation = () => {
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
    mutationFn: createGame(userData!),
    onSuccess: () => {
      queryClient.refetchQueries(["games"]);
      queryClient.refetchQueries(["bookings"]);
      navigation.pop(4);
      navigation.navigate("Home");
    },
  });
};
