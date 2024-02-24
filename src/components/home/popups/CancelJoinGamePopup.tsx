import { Dispatch, SetStateAction } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Game, PlayerStatus } from "src/types";
import { PopupContainer } from "./PopupContainer";

export const CancelJoinGamePopup = ({
  visible,
  setVisible,
  game,
  followedGames,
  playerStatus,
  cancelRequest,
  respondToInvite,
  unfollowGame,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  game?: Game;
  followedGames?: Game[];
  playerStatus?: PlayerStatus;
  cancelRequest: Function;
  respondToInvite: Function;
  unfollowGame: Function;
}) => {
  return (
    <PopupContainer
      title={`Are you sure you want to ${
        playerStatus?.hasRequestedtoJoin === "APPROVED" ||
        playerStatus?.hasBeenInvited === "APPROVED"
          ? "leave game"
          : "cancel your game request"
      }?`}
      visible={visible}
      setVisible={setVisible}
    >
      <View>
        <Button
          mode="contained"
          style={{
            marginBottom: 10,
            marginHorizontal: 20,
          }}
          onPress={() => {
            if (
              playerStatus?.hasRequestedtoJoin === "APPROVED" ||
              playerStatus?.hasRequestedtoJoin === "PENDING"
            )
              cancelRequest({
                requestId: playerStatus?.requestId as number,
                gameId: game?.id,
              });
            else if (playerStatus?.hasBeenInvited === "APPROVED")
              respondToInvite({
                gameId: game?.id,
                invitationId: playerStatus?.invitationId as number,
                status: "REJECTED",
              });
            if (
              followedGames?.some(
                (followedGame) => followedGame.id === game?.id
              )
            ) {
              unfollowGame({
                gameId: game?.id,
              });
            }
            setVisible(false);
          }}
        >
          Yes
        </Button>
        <Button onPress={() => setVisible(false)}>No</Button>
      </View>
    </PopupContainer>
  );
};
