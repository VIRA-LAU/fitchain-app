import React, { useState, useMemo, useEffect, useContext } from "react";
import { AppHeader } from "src/components";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { TabBar, TabBarProps, TabView } from "react-native-tab-view";
import { Team } from "./Team";
import {
  useFollowedGamesQuery,
  useFollowGameMutation,
  useGameByIdQuery,
  useGamePlayersQuery,
  usePlayerStatusQuery,
  useUnfollowGameMutation,
} from "src/api";
import { PopupContainer, PopupType } from "./Popups";
import { UserContext } from "src/utils";

type Props = StackScreenProps<HomeStackParamList, "GameDetails">;

export const GameDetails = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const windowWidth = useWindowDimensions().width;

  const { userData } = useContext(UserContext);

  const [popupVisible, setPopupVisible] = useState<PopupType | null>(null);
  const [joinDisabled, setJoinDisabled] = useState<boolean>(false);
  const [followDisabled, setFollowDisabled] = useState<boolean>(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Home", title: "Home" },
    { key: "Away", title: "Away" },
  ]);

  const { id } = route.params;
  const { data: game } = useGameByIdQuery(id);
  const { data: players } = useGamePlayersQuery(id);
  const { data: playerStatus } = usePlayerStatusQuery(id);
  const { data: followedGames } = useFollowedGamesQuery();

  const { mutate: followGame } = useFollowGameMutation(setFollowDisabled);
  const { mutate: unfollowGame } = useUnfollowGameMutation(setFollowDisabled);

  const dateHeader = useMemo(() => {
    if (game?.date) {
      let date = new Date(game.date);
      const bookingDate = new Date(
        date.toISOString().substring(0, date.toISOString().indexOf("T"))
      );
      const todayDate = new Date(
        new Date()
          .toISOString()
          .substring(0, new Date().toISOString().indexOf("T"))
      );
      const dayDiff =
        (bookingDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24);

      if (dayDiff === 0) return "Today";
      else if (dayDiff === 1) return "Tomorrow";
      else if (dayDiff <= 7) return "This Week";
      else if (dayDiff <= 30) return "This Month";
      else return "In the Future";
    }
  }, [game?.date]);

  useEffect(() => {
    const handleBack = () => {
      if (popupVisible) {
        setPopupVisible(null);
        return true;
      } else return false;
    };
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, [popupVisible]);

  if (!game || !players || !playerStatus || !followedGames) return <View />;
  else {
    const date = new Date(game.date);

    const renderScene = () => {
      const route = routes[index];
      switch (route.key) {
        case "Home":
          return (
            <Team
              name={"Home"}
              game={game}
              players={players.filter(
                ({ team, status }) => team === "HOME" && status !== "REJECTED"
              )}
            />
          );
        case "Away":
          return (
            <Team
              name={"Away"}
              game={game}
              players={players.filter(
                ({ team, status }) => team === "AWAY" && status !== "REJECTED"
              )}
            />
          );
        default:
          return null;
      }
    };

    const renderTabBar = (props: TabBarProps<any>) => (
      <TabBar
        {...props}
        style={{
          backgroundColor: colors.secondary,
          borderRadius: 10,
          marginHorizontal: 20,
          marginTop: 10,
        }}
        renderTabBarItem={({ route }) => {
          let isActive = route.key === props.navigationState.routes[index].key;
          return (
            <Pressable
              style={({ pressed }) => [
                styles.tabViewItem,
                {
                  width: 0.5 * (windowWidth - 40 - 20),
                  backgroundColor: isActive
                    ? colors.background
                    : colors.secondary,
                },
                pressed && { backgroundColor: colors.background },
              ]}
              onPress={() => {
                setIndex(routes.findIndex(({ key }) => route.key === key));
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  color: isActive ? "white" : colors.tertiary,
                }}
              >
                {route.title}
              </Text>
            </Pressable>
          );
        }}
        renderIndicator={() => <View style={{ width: 0 }} />}
      />
    );

    return (
      <React.Fragment>
        {popupVisible && (
          <PopupContainer
            game={game}
            popupVisible={popupVisible}
            setPopupVisible={setPopupVisible}
            setJoinDisabled={setJoinDisabled}
            followedGames={followedGames}
            setFollowDisabled={setFollowDisabled}
            playerStatus={playerStatus}
          />
        )}
        <AppHeader
          absolutePosition={false}
          backEnabled
          title={game.type}
          right={
            game.admin.id === userData?.userId ? (
              <TouchableOpacity
                onPress={() => {
                  setPopupVisible("recordVideo");
                }}
              >
                <IonIcon name="videocam" color={"black"} size={24} />
              </TouchableOpacity>
            ) : (
              <View />
            )
          }
          backgroundImage={game.type}
          navigation={navigation}
          route={route}
          darkMode
        >
          <View style={styles.wrapperView}>
            {new Date(game.date) > new Date() && (
              <View style={styles.headerView}>
                <Text variant="labelLarge" style={styles.greyFont}>
                  {dateHeader}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    variant="headlineSmall"
                    style={{ color: "white", marginTop: -5, marginBottom: 10 }}
                  >
                    {date
                      .toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                      .slice(0, -6)}
                  </Text>
                  <Text
                    variant="labelLarge"
                    style={{ color: "white", marginTop: -5, marginBottom: 10 }}
                  >
                    {game.gameTimeSlots[0].timeSlot.startTime} -{" "}
                    {
                      game.gameTimeSlots[game.gameTimeSlots.length - 1].timeSlot
                        .endTime
                    }
                  </Text>
                </View>
                {!playerStatus.isAdmin && (
                  <View style={styles.buttonsView}>
                    <Button
                      icon={() => (
                        <IonIcon
                          name={"basketball-outline"}
                          size={26}
                          color={colors.secondary}
                        />
                      )}
                      style={{
                        borderRadius: 5,
                        flex: 1,
                        backgroundColor: joinDisabled
                          ? colors.tertiary
                          : colors.primary,
                      }}
                      textColor={colors.secondary}
                      onPress={
                        joinDisabled
                          ? undefined
                          : playerStatus.hasRequestedtoJoin === "APPROVED" ||
                            playerStatus.hasRequestedtoJoin === "PENDING" ||
                            playerStatus.hasBeenInvited === "APPROVED"
                          ? () => {
                              setPopupVisible("cancelJoinGame");
                            }
                          : playerStatus.hasBeenInvited === "PENDING"
                          ? () => {
                              setPopupVisible("respondToInvitation");
                            }
                          : () => {
                              setPopupVisible("joinGame");
                            }
                      }
                    >
                      {playerStatus.hasBeenInvited === "APPROVED" ||
                      playerStatus.hasRequestedtoJoin === "APPROVED"
                        ? "Leave Game"
                        : playerStatus.hasBeenInvited === "PENDING"
                        ? "Invited to Game"
                        : playerStatus.hasRequestedtoJoin === "PENDING"
                        ? "Cancel Request"
                        : "Join Game"}
                    </Button>
                    <Button
                      icon={() => (
                        <FontAwesomeIcon
                          name={
                            followedGames.some((game) => game.id === id)
                              ? "thumbs-up"
                              : "thumbs-o-up"
                          }
                          size={22}
                          color={"white"}
                        />
                      )}
                      style={{ borderRadius: 5, flex: 1 }}
                      textColor={"white"}
                      buttonColor={"transparent"}
                      onPress={
                        followDisabled
                          ? undefined
                          : followedGames.some((game) => game.id === id)
                          ? () => {
                              setFollowDisabled(true);
                              unfollowGame({
                                gameId: game.id,
                              });
                            }
                          : () => {
                              setFollowDisabled(true);
                              followGame({
                                gameId: game.id,
                              });
                            }
                      }
                    >
                      {followedGames.some((game) => game.id === id)
                        ? "Unfollow Game"
                        : "Follow Game"}
                    </Button>
                  </View>
                )}
                {(playerStatus.isAdmin ||
                  playerStatus.hasBeenInvited === "APPROVED" ||
                  playerStatus.hasRequestedtoJoin === "APPROVED") && (
                  <Button
                    buttonColor={colors.primary}
                    textColor={colors.secondary}
                    style={{ borderRadius: 5, marginTop: 10 }}
                    icon={({ size, color }) => (
                      <Feather name="user-plus" size={size} color={color} />
                    )}
                    onPress={() => {
                      navigation.push("InviteUsers", { gameId: game.id });
                    }}
                  >
                    Invite Players
                  </Button>
                )}
              </View>
            )}

            <View style={styles.contentView}>
              <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: windowWidth }}
                swipeEnabled={false}
              />
            </View>
          </View>
        </AppHeader>
      </React.Fragment>
    );
  }
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flex: 1,
    },
    headerView: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: colors.secondary,
    },
    greyFont: { marginVertical: 10, color: colors.tertiary },
    buttonsView: {
      flexDirection: "row",
      marginTop: 10,
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentView: {
      flex: 1,
      paddingTop: 10,
    },
    tabViewItem: {
      height: 40,
      margin: 5,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
  });
