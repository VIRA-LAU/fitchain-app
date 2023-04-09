import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";
import { Game, GameType } from "src/types";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";

const createRating = (userData: UserData) => async (data: Object) => {
  const header = getHeader(userData);
  return await client
    .post("/users/rate", data, header)
    .then((res) => {
      console.log("rating player");
      return res.data;
    })
    .catch((e) => {
      console.error("create-game-mutation", e.response.data);
      throw new Error(e.message);
    });
};

export const useCreateRatingMutation = (gameId: number) => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();
  return useMutation<unknown, unknown, Object>({
    mutationFn: createRating(userData!),
    onSuccess: () => {
      queryClient.refetchQueries(["game-players", gameId]);
      navigation.navigate("GameDetails", { id: gameId });
    },
  });
};
