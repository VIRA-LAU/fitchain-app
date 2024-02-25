import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Avatar, Button, Text, TextInput, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader } from "src/components";
import {
  useGamePlayersQuery,
  useInvitePlayerMutation,
  useUsersQuery,
} from "src/api";
import IonIcon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import React, { useState } from "react";

type Props = StackScreenProps<HomeStackParamList, "InviteUsers">;

export const InviteUsers = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { gameId } = route.params;

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<"Home" | "Away">("Home");
  const [searchBarText, setSearchBarText] = useState<string>("");

  const { data: users } = useUsersQuery();
  const { data: existingPlayers } = useGamePlayersQuery(
    gameId,
    setLoadingIndex
  );

  const { mutate: invitePlayer } = useInvitePlayerMutation(setLoadingIndex);

  const filteredUsers = users?.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchBarText.toLowerCase())
  );

  if (!existingPlayers || !users) return <View />;
  return (
    <AppHeader absolutePosition={false} title={"Invite Friends"} backEnabled>
      <View style={styles.wrapper}>
        <View style={styles.teams}>
          <View style={{ flexGrow: 1, marginRight: 10 }}>
            <Button
              mode="contained"
              buttonColor={
                selectedTeam === "Home" ? colors.primary : colors.background
              }
              textColor={
                selectedTeam === "Home" ? colors.background : colors.primary
              }
              onPress={
                selectedTeam === "Home"
                  ? undefined
                  : () => {
                      setSelectedTeam("Home");
                    }
              }
            >
              Home
            </Button>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Button
              mode="contained"
              buttonColor={
                selectedTeam === "Away" ? colors.primary : colors.background
              }
              textColor={
                selectedTeam === "Away" ? colors.background : colors.primary
              }
              onPress={
                selectedTeam === "Away"
                  ? undefined
                  : () => {
                      setSelectedTeam("Away");
                    }
              }
            >
              Away
            </Button>
          </View>
        </View>
        <View style={styles.searchBarView}>
          <TextInput
            style={styles.searchBar}
            value={searchBarText}
            placeholder="Search"
            placeholderTextColor={colors.tertiary}
            cursorColor={colors.primary}
            onChangeText={setSearchBarText}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={searchBarText === ""}
            onPress={() => {
              setSearchBarText("");
            }}
          >
            <IonIcon
              name={searchBarText ? "close-outline" : "search-outline"}
              color={colors.primary}
              size={20}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ marginHorizontal: 16 }}
        >
          {filteredUsers?.map((user, index) => {
            var playerIndex = existingPlayers.findIndex(
              (player) => player.id === user.id
            );
            if (
              playerIndex !== -1 &&
              existingPlayers[playerIndex].status === "REJECTED"
            )
              playerIndex = -1;
            return (
              <View key={index} style={styles.user}>
                <View
                  style={{
                    marginRight: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {user.profilePhotoUrl ? (
                    <Avatar.Image
                      size={45}
                      source={{ uri: user.profilePhotoUrl }}
                      style={{ backgroundColor: colors.secondary }}
                    />
                  ) : (
                    <Avatar.Text
                      label={
                        user.firstName
                          ? `${user.firstName.charAt(0)}${user.lastName.charAt(
                              0
                            )}`
                          : ""
                      }
                      labelStyle={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 20,
                      }}
                      size={45}
                      style={{
                        backgroundColor: colors.secondary,
                      }}
                    />
                  )}
                </View>
                <View>
                  <Text style={styles.name}>
                    {user.firstName} {user.lastName}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <IonIcon
                      name={"star-outline"}
                      color={colors.tertiary}
                      size={14}
                    />
                    <Text
                      style={[styles.name, { fontSize: 14, marginLeft: 10 }]}
                    >
                      {user.rating ? user.rating : 0}
                    </Text>
                  </View>
                </View>
                {playerIndex === -1 ? (
                  <View style={styles.inviteView}>
                    <Button
                      mode="contained"
                      style={styles.inviteButton}
                      loading={loadingIndex === user.id}
                      textColor={colors.tertiary}
                      buttonColor={colors.background}
                      onPress={
                        loadingIndex !== user.id
                          ? () => {
                              invitePlayer({
                                gameId,
                                friendId: user.id,
                                team: selectedTeam.toUpperCase() as
                                  | "HOME"
                                  | "AWAY",
                              });
                            }
                          : undefined
                      }
                    >
                      Invite
                    </Button>
                  </View>
                ) : (
                  <View style={styles.invitedView}>
                    <Feather
                      name="user-check"
                      size={18}
                      color={colors.tertiary}
                    />
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        color: colors.tertiary,
                        marginLeft: 10,
                      }}
                    >
                      Invited
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexGrow: 1,
      paddingTop: 16,
    },
    locationComponent: {
      color: colors.tertiary,
      margin: 20,
    },
    searchBarView: {
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.secondary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: 16,
      marginBottom: 16,
      paddingRight: 16,
    },
    searchBar: {
      color: colors.tertiary,
      fontFamily: "Poppins-Regular",
      fontSize: 12,
      height: 40,
      flexGrow: 1,
      paddingHorizontal: 16,
    },
    user: {
      flexDirection: "row",
      alignItems: "center",
      height: 80,
      marginVertical: 3,
      borderBottomColor: colors.tertiary,
      borderBottomWidth: 0.5,
    },
    name: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
      fontSize: 16,
    },
    teams: {
      flexDirection: "row",
      marginBottom: 16,
      marginHorizontal: 16,
    },
    inviteView: {
      marginLeft: "auto",
      marginRight: 10,
    },
    inviteButton: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.tertiary,
    },
    invitedView: {
      marginLeft: "auto",
      marginRight: 10,
      flexDirection: "row",
      alignItems: "center",
    },
  });
