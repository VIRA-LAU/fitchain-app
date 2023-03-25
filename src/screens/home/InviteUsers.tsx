import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, Image, Pressable } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
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
import { useEffect, useState } from "react";

type Props = StackScreenProps<HomeStackParamList, "InviteUsers">;

export const InviteUsers = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { gameId } = route.params;

  const { data: users } = useUsersQuery();
  const { data: existingPlayers } = useGamePlayersQuery(gameId);

  const { mutate: invitePlayer } = useInvitePlayerMutation();

  const [selectedTeam, setSelectedTeam] = useState<"Home" | "Away">("Home");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

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
          {users
            ?.filter(
              ({ id }) =>
                existingPlayers.findIndex((player) => player.id === id) === -1
            )
            .map((user, index) => (
              <Pressable
                key={index}
                style={[
                  styles.user,
                  selectedUsers.includes(user.id) ? { borderWidth: 1 } : {},
                ]}
                onPress={() => {
                  if (!selectedUsers.includes(user.id)) {
                    setSelectedUsers([...selectedUsers, user.id]);
                  } else {
                    setSelectedUsers(
                      selectedUsers.filter(
                        (selectedUser) => selectedUser !== user.id
                      )
                    );
                  }
                }}
              >
                <Image
                  source={require("assets/images/home/profile-picture.png")}
                  style={{ height: 50, width: 50, marginRight: 20 }}
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
                    <Text
                      style={[styles.name, { fontSize: 14, marginLeft: 10 }]}
                    >
                      {user.rating ? user.rating : 0}
                    </Text>
                  </View>
                </View>
                {selectedUsers.includes(user.id) && (
                  <Feather
                    name="check"
                    size={25}
                    color={colors.primary}
                    style={{ marginLeft: "auto", marginRight: 10 }}
                  />
                )}
              </Pressable>
            ))}
        </ScrollView>

        <Button
          buttonColor={
            selectedUsers.length > 0 ? colors.primary : colors.tertiary
          }
          textColor={colors.secondary}
          style={{ borderRadius: 5 }}
          icon={({ size, color }) => (
            <Feather name="user-plus" size={size} color={color} />
          )}
          onPress={
            selectedUsers.length > 0
              ? () => {
                  invitePlayer({
                    gameId,
                    friendId: selectedUsers,
                    team: selectedTeam.toUpperCase() as "HOME" | "AWAY",
                  });
                }
              : undefined
          }
        >
          Invite Players
        </Button>
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
      backgroundColor: colors.secondary,
      flexDirection: "row",
      alignItems: "center",
      height: 80,
      borderRadius: 10,
      marginVertical: 10,
      paddingHorizontal: 20,
      borderColor: colors.primary,
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
  });
