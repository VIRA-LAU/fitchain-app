import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Game, PlayerStatus } from "src/types";
import { RecordGamePopup } from "./RecordGamePopup";
import { BottomModal } from "../modals";

export type PopupType =
  | "joinGame"
  | "cancelJoinGame"
  | "respondToInvitation"
  | "recordVideo";

export const PopupContainer = ({
  game,
  popupVisible,
  setPopupVisible,
  followedGames,
  playerStatus,
  joinGame,
  cancelRequest,
  respondToInvite,
  followGame,
  unfollowGame,
}: {
  game?: Game;
  popupVisible: PopupType | null;
  setPopupVisible: Dispatch<SetStateAction<PopupType | null>>;
  followedGames?: Game[];
  playerStatus?: PlayerStatus;
  joinGame: Function;
  cancelRequest: Function;
  respondToInvite: Function;
  followGame: Function;
  unfollowGame: Function;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (popupVisible === "joinGame")
    return (
      <BottomModal
        visible={popupVisible !== null}
        setVisible={(state) => {
          if (!state) setPopupVisible(null);
        }}
      >
        <View style={[styles.prompt, { paddingBottom: 20 }]}>
          <Text style={styles.promptText}>Choose Team</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={styles.promptTeam}
              onPress={() => {
                setPopupVisible(null);
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
                setPopupVisible(null);
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
        </View>
      </BottomModal>
    );
  else if (popupVisible === "cancelJoinGame")
    return (
      <BottomModal
        visible={popupVisible !== null}
        setVisible={(state) => {
          if (!state) setPopupVisible(null);
        }}
      >
        <View style={styles.prompt}>
          <Text style={styles.promptText}>
            Are you sure you want to{" "}
            {playerStatus?.hasRequestedtoJoin === "APPROVED" ||
            playerStatus?.hasBeenInvited === "APPROVED"
              ? "leave game"
              : "cancel your game request"}
            ?
          </Text>
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
              setPopupVisible(null);
            }}
          >
            Yes
          </Button>
          <Button onPress={() => setPopupVisible(null)}>No</Button>
        </View>
      </BottomModal>
    );
  else if (popupVisible === "respondToInvitation")
    return (
      <BottomModal
        visible={popupVisible !== null}
        setVisible={(state) => {
          if (!state) setPopupVisible(null);
        }}
      >
        <View style={styles.prompt}>
          <Text style={styles.promptText}>
            Would you like to join this game?
          </Text>
          <Button
            mode="contained"
            style={{
              marginBottom: 10,
              marginHorizontal: 20,
            }}
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
              setPopupVisible(null);
            }}
          >
            Yes
          </Button>
          <Button
            mode="contained"
            buttonColor={colors.tertiary}
            style={{
              marginBottom: 10,
              marginHorizontal: 20,
            }}
            onPress={() => {
              respondToInvite({
                gameId: game?.id,
                invitationId: playerStatus?.invitationId as number,
                status: "REJECTED",
              });
              setPopupVisible(null);
            }}
          >
            No
          </Button>
          <Button onPress={() => setPopupVisible(null)}>Later</Button>
        </View>
      </BottomModal>
    );
  else
    return (
      <BottomModal
        visible={popupVisible !== null}
        setVisible={(state) => {
          if (!state) setPopupVisible(null);
        }}
      >
        <View style={styles.prompt}>
          <RecordGamePopup game={game} setPopupVisible={setPopupVisible} />
        </View>
      </BottomModal>
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
      fontFamily: "Inter-Medium",
      textAlign: "center",
      color: "white",
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
      fontFamily: "Inter-Medium",
      textAlign: "center",
      color: "white",
      fontSize: 20,
    },
  });
