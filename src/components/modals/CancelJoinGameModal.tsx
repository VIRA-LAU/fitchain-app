import { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { Game, PlayerStatus } from "src/types";
import { ModalContainer } from "./ModalContainer";

export const CancelJoinGameModal = ({
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
    <ModalContainer
      title={`Are you sure you want to ${
        playerStatus?.hasRequestedtoJoin === "APPROVED" ||
        playerStatus?.hasBeenInvited === "APPROVED"
          ? "leave game"
          : "cancel your game request"
      }?`}
      visible={visible}
      setVisible={setVisible}
    >
      <View style={{ gap: 8 }}>
        <Button
          mode="contained"
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
    </ModalContainer>
  );
};
