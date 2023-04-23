import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader } from "src/components";
import { ScrollView } from "react-native-gesture-handler";
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

  const { data: users } = useUsersQuery();
  const { data: existingPlayers } = useGamePlayersQuery(
    gameId,
    setLoadingIndex
  );

  const { mutate: invitePlayer } = useInvitePlayerMutation(setLoadingIndex);

  if (!existingPlayers || !users) return <View />;
  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Invite Players"}
      backEnabled
    >
      <View style={styles.wrapper}>
        <View style={styles.teams}>
          <Button
            buttonColor={
              selectedTeam === "Home" ? colors.primary : colors.tertiary
            }
            textColor={colors.secondary}
            style={{ flex: 1, borderRadius: 5, marginRight: 10 }}
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
          <Button
            buttonColor={
              selectedTeam === "Away" ? colors.primary : colors.tertiary
            }
            textColor={colors.secondary}
            style={{ flex: 1, borderRadius: 5 }}
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {users.map((user, index) => (
            <View key={index} style={styles.user}>
              <Image
                source={require("assets/images/home/profile-picture.png")}
                style={{ height: 45, width: 45, marginRight: 20 }}
                resizeMode="contain"
              />
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
                  <IonIcon name={"star-outline"} color={"white"} size={14} />
                  <Text style={[styles.name, { fontSize: 14, marginLeft: 10 }]}>
                    {user.rating ? user.rating : 0}
                  </Text>
                </View>
              </View>
              {existingPlayers.findIndex((player) => player.id === user.id) ===
              -1 ? (
                loadingIndex === user.id ? (
                  <ActivityIndicator
                    style={{
                      marginLeft: "auto",
                      marginRight: 30,
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.inviteView}
                    onPress={() => {
                      invitePlayer({
                        gameId,
                        friendId: user.id,
                        team: selectedTeam.toUpperCase() as "HOME" | "AWAY",
                      });
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter-Medium",
                        color: "white",
                      }}
                    >
                      Invite
                    </Text>
                  </TouchableOpacity>
                )
              ) : (
                <View style={styles.invitedView}>
                  <Feather
                    name="user-check"
                    size={18}
                    color={colors.tertiary}
                  />
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      color: colors.tertiary,
                      marginLeft: 10,
                    }}
                  >
                    Invited
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexGrow: 1,
      padding: 20,
    },
    locationComponent: {
      color: colors.tertiary,
      margin: 20,
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
      fontFamily: "Inter-SemiBold",
      color: "white",
      fontSize: 16,
    },
    teams: {
      flexDirection: "row",
      marginBottom: 10,
    },
    inviteView: {
      marginLeft: "auto",
      marginRight: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "white",
      padding: 10,
      paddingHorizontal: 20,
    },
    invitedView: {
      marginLeft: "auto",
      marginRight: 10,
      flexDirection: "row",
      alignItems: "center",
    },
  });
