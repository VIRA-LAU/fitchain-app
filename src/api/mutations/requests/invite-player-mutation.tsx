import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, UserData } from "../../../utils/UserContext";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

type Request = {
  gameId: number;
  friendId: number[];
  team: "HOME" | "AWAY";
};

type Response = {
  id: number;
  friendId: number;
  gameId: number;
  team: "HOME" | "AWAY";
  status: string;
};

const invitePlayer = (userData: UserData) => async (data: Request) => {
  const header = getHeader(userData);
  return await client
    .post("/invitations", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("invite-player-mutation", e);
      throw new Error(e);
    });
};

export const useInvitePlayerMutation = () => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  return useMutation<Response[], unknown, Request>({
    mutationFn: invitePlayer(userData!),
    onSuccess: (data, variables) => {
      queryClient.refetchQueries(["game-players", variables.gameId]);
      navigation.goBack();
    },
  });
};
