import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Game } from "src/types";
import { ModalContainer } from "./ModalContainer";

export const JoinGameModal = ({
  visible,
  setVisible,
  game,
  joinGame,
  followedGames,
  followGame,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  game?: Game;
  joinGame: Function;
  followedGames?: Game[];
  followGame: Function;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <ModalContainer
      title="Choose Team"
      visible={visible}
      setVisible={setVisible}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={styles.promptTeam}
          onPress={() => {
            setVisible(false);
            joinGame({
              gameId: game?.id,
              team: "HOME",
            });
            if (
              !followedGames?.some(
                (followedGame) => game?.id === followedGame.id
              )
            ) {
              followGame({
                gameId: game?.id,
              });
            }
          }}
        >
          <Text style={styles.promptTeamText}>Home</Text>
        </TouchableOpacity>
        <View style={styles.promptDivider} />
        <TouchableOpacity
          style={styles.promptTeam}
          onPress={() => {
            setVisible(false);
            joinGame({
              gameId: game?.id,
              team: "AWAY",
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
          }}
        >
          <Text style={styles.promptTeamText}>Away</Text>
        </TouchableOpacity>
      </View>
    </ModalContainer>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
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
