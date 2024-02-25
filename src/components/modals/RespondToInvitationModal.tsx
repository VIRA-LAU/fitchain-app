import { Dispatch, SetStateAction } from "react";
import { StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Game, PlayerStatus } from "src/types";
import { ModalContainer } from "./ModalContainer";

export const RespondToInvitationModal = ({
  visible,
  setVisible,
  game,
  followedGames,
  followGame,
  playerStatus,
  respondToInvite,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  game?: Game;
  followedGames?: Game[];
  followGame: Function;
  playerStatus?: PlayerStatus;
  respondToInvite: Function;
}) => {
  const { colors } = useTheme();

  return (
    <ModalContainer
      title={"Would you like to join this game?"}
      visible={visible}
      setVisible={setVisible}
    >
      <View style={{ gap: 8 }}>
        <Button
          mode="contained"
          style={{}}
          onPress={() => {
            respondToInvite({
              gameId: game?.id,
              invitationId: playerStatus?.invitationId as number,
              status: "APPROVED",
            });
            if (
              !followedGames?.some(
                (followedGame) => followedGame.id === game?.id
              )
            ) {
              followGame({
                gameId: game?.id,
              });
            }
            setVisible(false);
          }}
        >
          Yes
        </Button>
        <Button
          mode="contained"
          buttonColor={colors.secondary}
          textColor={colors.primary}
          onPress={() => {
            respondToInvite({
              gameId: game?.id,
              invitationId: playerStatus?.invitationId as number,
              status: "REJECTED",
            });
            setVisible(false);
          }}
        >
          No
        </Button>
        <Button onPress={() => setVisible(false)}>Later</Button>
      </View>
    </ModalContainer>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    prompt: {
      marginTop: "auto",
      marginBottom: "auto",
      marginLeft: "auto",
      marginRight: "auto",
      paddingTop: 20,
      paddingBottom: 10,
      width: "75%",
      backgroundColor: colors.background,
      borderRadius: 10,
    },
    promptText: {
      fontFamily: "Poppins-Regular",
      textAlign: "center",
      color: colors.tertiary,
      marginBottom: 30,
      marginHorizontal: 20,
      lineHeight: 20,
    },
    promptTeam: {
      flex: 1,
      height: 100,
      justifyContent: "center",
    },
    promptDivider: {
      borderLeftColor: colors.primary,
      borderLeftWidth: 1,
    },
    promptTeamText: {
      fontFamily: "Poppins-Regular",
      textAlign: "center",
      color: colors.tertiary,
      fontSize: 20,
    },
  });