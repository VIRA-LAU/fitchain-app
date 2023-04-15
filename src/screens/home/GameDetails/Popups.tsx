import { Dispatch, SetStateAction, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  useDeleteJoinRequestMutation,
  useFollowGameMutation,
  useJoinGameMutation,
  useRespondToInviteMutation,
  useStartStopRecording,
  useUnfollowGameMutation,
} from "src/api";
import { Game, PlayerStatus } from "src/types";

export type PopupType =
  | "joinGame"
  | "cancelJoinGame"
  | "respondToInvitation"
  | "recordVideo";

export const PopupContainer = ({
  game,
  popupVisible,
  setPopupVisible,
  setJoinDisabled,
  followedGames,
  setFollowDisabled,
  playerStatus,
}: {
  game: Game;
  popupVisible: PopupType | null;
  setPopupVisible: Dispatch<SetStateAction<PopupType | null>>;
  setJoinDisabled: Dispatch<SetStateAction<boolean>>;
  followedGames?: Game[];
  setFollowDisabled: Dispatch<SetStateAction<boolean>>;
  playerStatus: PlayerStatus;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { mutate: joinGame } = useJoinGameMutation(setJoinDisabled);
  const { mutate: cancelRequest } =
    useDeleteJoinRequestMutation(setJoinDisabled);
  const { mutate: respondToInvite } =
    useRespondToInviteMutation(setJoinDisabled);

  const { mutate: followGame } = useFollowGameMutation(setFollowDisabled);
  const { mutate: unfollowGame } = useUnfollowGameMutation(setFollowDisabled);
  const { mutate: startStopRecording } = useStartStopRecording(game.id);

  if (popupVisible === "joinGame")
    return (
      <Pressable
        style={styles.promptView}
        onPress={() => setPopupVisible(null)}
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
                setJoinDisabled(true);
                joinGame({
                  gameId: game.id,
                  team: "HOME",
                });
                if (
                  !followedGames?.some(
                    (followedGame) => game.id === followedGame.id
                  )
                ) {
                  setFollowDisabled(true);
                  followGame({
                    gameId: game.id,
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
                setJoinDisabled(true);
                joinGame({
                  gameId: game.id,
                  team: "AWAY",
                });
                if (
                  !followedGames?.some(
                    (followedGame) => followedGame.id === game.id
                  )
                ) {
                  setFollowDisabled(true);
                  followGame({
                    gameId: game.id,
                  });
                }
              }}
            >
              <Text style={styles.promptTeamText}>Away</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  else if (popupVisible === "cancelJoinGame")
    return (
      <Pressable
        style={styles.promptView}
        onPress={() => setPopupVisible(null)}
      >
        <View style={styles.prompt}>
          <Text style={styles.promptText}>
            Are you sure you want to{" "}
            {playerStatus.hasRequestedtoJoin === "APPROVED" ||
            playerStatus.hasBeenInvited === "APPROVED"
              ? "leave game"
              : "cancel your game request"}
            ?
          </Text>
          <Button
            buttonColor={colors.primary}
            textColor={colors.background}
            style={{
              borderRadius: 5,
              marginBottom: 10,
              marginHorizontal: 20,
            }}
            onPress={() => {
              setJoinDisabled(true);
              if (
                playerStatus.hasRequestedtoJoin === "APPROVED" ||
                playerStatus.hasRequestedtoJoin === "PENDING"
              )
                cancelRequest({
                  requestId: playerStatus.requestId as number,
                  gameId: game.id,
                });
              else if (playerStatus.hasBeenInvited === "APPROVED")
                respondToInvite({
                  gameId: game.id,
                  invitationId: playerStatus.invitationId as number,
                  status: "REJECTED",
                });
              if (
                followedGames?.some(
                  (followedGame) => followedGame.id === game.id
                )
              ) {
                setFollowDisabled(true);
                unfollowGame({
                  gameId: game.id,
                });
              }
              setPopupVisible(null);
            }}
          >
            Yes
          </Button>
          <Button onPress={() => setPopupVisible(null)}>No</Button>
        </View>
      </Pressable>
    );
  else if (popupVisible === "respondToInvitation")
    return (
      <Pressable
        style={styles.promptView}
        onPress={() => setPopupVisible(null)}
      >
        <View style={styles.prompt}>
          <Text style={styles.promptText}>
            Would you like to join this game?
          </Text>
          <Button
            buttonColor={colors.primary}
            textColor={colors.background}
            style={{
              borderRadius: 5,
              marginBottom: 10,
              marginHorizontal: 20,
            }}
            onPress={() => {
              setJoinDisabled(true);
              respondToInvite({
                gameId: game.id,
                invitationId: playerStatus.invitationId as number,
                status: "APPROVED",
              });
              if (
                !followedGames?.some(
                  (followedGame) => followedGame.id === game.id
                )
              ) {
                setFollowDisabled(true);
                followGame({
                  gameId: game.id,
                });
              }
              setPopupVisible(null);
            }}
          >
            Yes
          </Button>
          <Button
            buttonColor={colors.tertiary}
            textColor={colors.background}
            style={{
              borderRadius: 5,
              marginBottom: 10,
              marginHorizontal: 20,
            }}
            onPress={() => {
              setJoinDisabled(true);
              respondToInvite({
                gameId: game.id,
                invitationId: playerStatus.invitationId as number,
                status: "REJECTED",
              });
              setPopupVisible(null);
            }}
          >
            No
          </Button>
          <Button onPress={() => setPopupVisible(null)}>Later</Button>
        </View>
      </Pressable>
    );
  else
    return (
      <Pressable
        style={styles.promptView}
        onPress={() => setPopupVisible(null)}
      >
        <View style={styles.prompt}>
          <Text style={styles.promptText}>Record a video from the court.</Text>
          {!game.isRecording ? (
            <Button
              buttonColor={colors.primary}
              textColor={colors.background}
              style={{
                borderRadius: 5,
                marginBottom: 10,
                marginHorizontal: 20,
              }}
              onPress={() => {
                startStopRecording({ recordingMode: "start" });
              }}
            >
              Start Recording
            </Button>
          ) : (
            <Button
              buttonColor={colors.primary}
              textColor={colors.background}
              style={{
                borderRadius: 5,
                marginBottom: 10,
                marginHorizontal: 20,
              }}
              onPress={() => {
                startStopRecording({ recordingMode: "stop" });
              }}
            >
              Stop Recording
            </Button>
          )}
          <Button onPress={() => setPopupVisible(null)}>Cancel</Button>
        </View>
      </Pressable>
    );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    promptView: {
      position: "absolute",
      zIndex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    prompt: {
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
