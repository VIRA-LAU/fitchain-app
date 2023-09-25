import React, {
  useState,
  useMemo,
  useContext,
  Fragment,
  ReactNode,
  useEffect,
} from "react";
import {
  AppHeader,
  BottomModal,
  BranchLocation,
  BranchLocationSkeleton,
  ResultCard,
  SelectionModal,
  Skeleton,
  UpdateCard,
  UpdateCardSkeleton,
  getMins,
  parseTimeFromMinutes,
  Team,
  AssignPlayer,
} from "src/components";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  TouchableOpacity,
  Platform,
  ScrollView,
  Linking,
  Image,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { TabBar, TabView } from "react-native-tab-view";
import {
  useDeleteJoinRequestMutation,
  useFollowedGamesQuery,
  useFollowGameMutation,
  useGameByIdQuery,
  useGamePlayersQuery,
  useJoinGameMutation,
  usePlayerStatusQuery,
  useRespondToInviteMutation,
  useUnfollowGameMutation,
  useUpdatesQuery,
} from "src/api";
import {
  PopupContainer,
  PopupType,
} from "../../components/game-details/Popups";
import { UserContext } from "src/utils";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import { RefreshControl } from "react-native";
import { PlayerStatistics } from "src/types";

type Props = StackScreenProps<StackParamList, "GameDetails">;

export const GameDetails = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const windowWidth = useWindowDimensions().width;

  const { userData } = useContext(UserContext);

  const [popupVisible, setPopupVisible] = useState<PopupType | null>(null);
  const [recordingModalVisible, setRecordingModalVisible] =
    useState<boolean>(false);
  const [assignPlayerVisible, setAssignPlayerVisible] =
    useState<PlayerStatistics | null>(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Home", title: "Home" },
    { key: "Away", title: "Away" },
  ]);
  const [videoFocusVisible, setVideoFocusVisible] = useState<string | null>(
    null
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { id, isPrevious } = route.params;
  const {
    data: game,
    isLoading: gameDetailsLoading,
    refetch: refetchGame,
  } = useGameByIdQuery(id);
  const {
    data: players,
    isFetching: playersLoading,
    refetch: refetchPlayers,
  } = useGamePlayersQuery(id);
  const {
    data: playerStatus,
    isFetching: playerStatusLoading,
    refetch: refetchPlayerStatus,
  } = usePlayerStatusQuery(id);
  const {
    data: followedGames,
    isLoading: followedGamesLoading,
    isFetching: followedGamesFetching,
    refetch: refetchFollowedGames,
  } = useFollowedGamesQuery();
  const {
    data: gameUpdates,
    isFetching: updatesLoading,
    refetch: refetchUpdates,
  } = useUpdatesQuery(game?.id);

  const { mutate: joinGame, isLoading: joinLoading } = useJoinGameMutation();
  const { mutate: cancelRequest, isLoading: cancelLoading } =
    useDeleteJoinRequestMutation();
  const { mutate: respondToInvite, isLoading: respondLoading } =
    useRespondToInviteMutation();
  const { mutate: followGame, isLoading: followLoading } =
    useFollowGameMutation();
  const { mutate: unfollowGame, isLoading: unfollowLoading } =
    useUnfollowGameMutation();

  const dateHeader = useMemo(() => {
    if (game?.startTime) {
      let date = game.startTime;
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
  }, [game?.startTime]);

  let updateCards: { card: ReactNode; date: Date }[] = [];

  if (gameUpdates) {
    updateCards.push({
      card: (
        <UpdateCard
          key="created"
          type="create"
          name={`${gameUpdates.admin.firstName} ${gameUpdates.admin.lastName}`}
          profilePhotoUrl={gameUpdates.admin.profilePhotoUrl}
          date={new Date(gameUpdates.createdAt)}
          gameId={game?.id}
          profileId={gameUpdates.admin.id}
          playerStatus={playerStatus}
        />
      ),
      date: new Date(gameUpdates.createdAt),
    });
    gameUpdates.gameInvitation.forEach((invitation, index) => {
      if (invitation.status !== "REJECTED")
        updateCards.push({
          card: (
            <UpdateCard
              key={`invitation-${index}`}
              type={invitation.status === "APPROVED" ? "join" : "invitation"}
              name={
                invitation.status === "APPROVED"
                  ? `${invitation.friend.firstName} ${invitation.friend.lastName}`
                  : `${invitation.user.firstName} ${invitation.user.lastName}`
              }
              friendName={`${invitation.friend.firstName} ${invitation.friend.lastName}`}
              profilePhotoUrl={invitation.friend.profilePhotoUrl}
              date={new Date(invitation.createdAt)}
              gameId={game?.id}
              profileId={invitation.friend.id}
              playerStatus={playerStatus}
            />
          ),
          date: new Date(invitation.createdAt),
        });
    });
    gameUpdates.gameRequests.forEach((request, index) => {
      if (request.status !== "REJECTED")
        updateCards.push({
          card: (
            <UpdateCard
              key={`request-${index}`}
              type={request.status === "APPROVED" ? "join" : "join-request"}
              name={`${request.user.firstName} ${request.user.lastName}`}
              profilePhotoUrl={request.user.profilePhotoUrl}
              date={new Date(request.createdAt)}
              requestId={request.id}
              gameId={game?.id}
              profileId={request.user.id}
              playerStatus={playerStatus}
            />
          ),
          date: new Date(request.createdAt),
        });
    });
    updateCards = updateCards.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }

  useEffect(() => {
    if (
      !gameDetailsLoading &&
      !playersLoading &&
      !playerStatusLoading &&
      !followedGamesFetching &&
      !updatesLoading
    )
      setRefreshing(false);
  }, [
    gameDetailsLoading,
    playersLoading,
    playerStatusLoading,
    followedGamesFetching,
    updatesLoading,
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    refetchGame();
    refetchPlayers();
    refetchPlayerStatus();
    refetchFollowedGames();
    refetchUpdates();
  };

  const renderScene = () => {
    const route = routes[index];
    switch (route.key) {
      case "Home":
        return (
          <Team
            game={game}
            players={
              isPrevious
                ? players?.filter(
                    ({ team, status }) =>
                      team === "HOME" && status === "APPROVED"
                  )
                : players?.filter(
                    ({ team, status }) =>
                      team === "HOME" && status !== "REJECTED"
                  )
            }
            playersLoading={playersLoading}
            isPrevious={isPrevious}
            playerStatus={playerStatus}
            teamIndex={index}
            setAssignPlayerVisible={setAssignPlayerVisible}
          />
        );
      case "Away":
        return (
          <Team
            game={game}
            players={
              isPrevious
                ? players?.filter(
                    ({ team, status }) =>
                      team === "AWAY" && status === "APPROVED"
                  )
                : players?.filter(
                    ({ team, status }) =>
                      team === "AWAY" && status !== "REJECTED"
                  )
            }
            playersLoading={playersLoading}
            isPrevious={isPrevious}
            playerStatus={playerStatus}
            teamIndex={index}
            setAssignPlayerVisible={setAssignPlayerVisible}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 10,
      }}
      renderTabBarItem={({ route }) => {
        let isActive = route.key === props.navigationState.routes[index].key;
        return (
          <Pressable
            key={route.key}
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
                fontFamily: "Poppins-Regular",
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
    <Fragment>
      {popupVisible && (
        <PopupContainer
          game={game}
          popupVisible={popupVisible}
          setPopupVisible={setPopupVisible}
          followedGames={followedGames}
          playerStatus={playerStatus}
          joinGame={joinGame}
          cancelRequest={cancelRequest}
          respondToInvite={respondToInvite}
          followGame={followGame}
          unfollowGame={unfollowGame}
        />
      )}
      <AppHeader
        absolutePosition={false}
        backEnabled
        title={game?.type}
        right={
          game?.admin.id === userData?.userId ? (
            <TouchableOpacity
              onPress={() => {
                setRecordingModalVisible(true);
              }}
            >
              <IonIcon name="ellipsis-horizontal" color={"black"} size={24} />
            </TouchableOpacity>
          ) : (
            <View />
          )
        }
        backgroundImage={game?.type}
        darkMode
      >
        <View style={styles.wrapperView}>
          <SelectionModal
            visible={recordingModalVisible}
            setVisible={setRecordingModalVisible}
            options={
              !isPrevious
                ? [
                    {
                      text: "Record Game",
                      onPress: () => {
                        setRecordingModalVisible(false);
                        setPopupVisible("recordVideo");
                      },
                    },
                  ]
                : [
                    {
                      text: "Upload Video",
                      onPress: () => {
                        setRecordingModalVisible(false);
                        setPopupVisible("uploadVideo");
                      },
                    },
                  ]
            }
          />
          {gameDetailsLoading || playerStatusLoading || followedGamesLoading ? (
            <View style={styles.headerView}>
              <Skeleton height={15} width={80} style={styles.greyFont} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Skeleton
                  height={30}
                  width={160}
                  style={{ color: "white", marginTop: -5, marginBottom: 10 }}
                />
                <Skeleton
                  height={15}
                  width={80}
                  style={{ color: "white", marginTop: -5, marginBottom: 10 }}
                />
              </View>
              <Skeleton
                height={40}
                width={"100%"}
                style={{ borderRadius: 5 }}
              />
            </View>
          ) : (
            <View style={styles.headerView}>
              <Text variant="labelLarge" style={styles.greyFont}>
                {dateHeader}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  variant="titleLarge"
                  style={{ color: "white", maxWidth: "75%" }}
                >
                  {game!.startTime
                    .toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    .slice(0, Platform.OS === "ios" ? -5 : -6)}
                </Text>
                <Text variant="labelLarge" style={{ color: "white" }}>
                  {parseTimeFromMinutes(getMins(game!.startTime))}
                  {" -\n"}
                  {parseTimeFromMinutes(getMins(game!.endTime))}
                </Text>
              </View>
              {!playerStatus?.isAdmin && !isPrevious && (
                <View style={styles.buttonsView}>
                  <View
                    style={{
                      width: "50%",
                    }}
                  >
                    <Button
                      icon={() => (
                        <IonIcon
                          name={"basketball-outline"}
                          size={26}
                          color={colors.secondary}
                        />
                      )}
                      mode="contained"
                      loading={joinLoading || cancelLoading || respondLoading}
                      onPress={
                        !(joinLoading || cancelLoading || respondLoading)
                          ? playerStatus?.hasRequestedtoJoin === "APPROVED" ||
                            playerStatus?.hasRequestedtoJoin === "PENDING" ||
                            playerStatus?.hasBeenInvited === "APPROVED"
                            ? () => {
                                setPopupVisible("cancelJoinGame");
                              }
                            : playerStatus?.hasBeenInvited === "PENDING"
                            ? () => {
                                setPopupVisible("respondToInvitation");
                              }
                            : () => {
                                setPopupVisible("joinGame");
                              }
                          : undefined
                      }
                    >
                      {playerStatus?.hasBeenInvited === "APPROVED" ||
                      playerStatus?.hasRequestedtoJoin === "APPROVED"
                        ? "Leave Game"
                        : playerStatus?.hasBeenInvited === "PENDING"
                        ? "Invited to Game"
                        : playerStatus?.hasRequestedtoJoin === "PENDING"
                        ? "Cancel Request"
                        : "Join Game"}
                    </Button>
                  </View>
                  <View
                    style={{
                      width: "50%",
                    }}
                  >
                    <Button
                      icon={() => (
                        <FontAwesomeIcon
                          name={
                            followedGames?.some((game) => game?.id === id)
                              ? "thumbs-up"
                              : "thumbs-o-up"
                          }
                          size={22}
                          color={"white"}
                        />
                      )}
                      loading={
                        followLoading ||
                        unfollowLoading ||
                        followedGamesFetching
                      }
                      textColor={"white"}
                      onPress={
                        !(
                          followLoading ||
                          unfollowLoading ||
                          followedGamesFetching
                        )
                          ? followedGames?.some((game) => game?.id === id)
                            ? () => {
                                unfollowGame({
                                  gameId: game?.id,
                                });
                              }
                            : () => {
                                followGame({
                                  gameId: game?.id,
                                });
                              }
                          : undefined
                      }
                    >
                      {followedGames?.some((game) => game?.id === id)
                        ? "Unfollow Game"
                        : "Follow Game"}
                    </Button>
                  </View>
                </View>
              )}
              {(playerStatus?.isAdmin ||
                playerStatus?.hasBeenInvited === "APPROVED" ||
                playerStatus?.hasRequestedtoJoin === "APPROVED") &&
                !isPrevious && (
                  <Button
                    mode="contained"
                    style={{ marginTop: 10 }}
                    icon={({ size, color }) => (
                      <Feather name="user-plus" size={size} color={color} />
                    )}
                    onPress={() => {
                      navigation.push("InviteUsers", { gameId: game?.id });
                    }}
                  >
                    Invite Players
                  </Button>
                )}
            </View>
          )}

          <ScrollView
            contentContainerStyle={{ paddingBottom: 10 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                progressBackgroundColor={colors.secondary}
              />
            }
          >
            {isPrevious && (
              <ResultCard
                game={game}
                setVideoFocusVisible={setVideoFocusVisible}
              />
            )}
            <Text
              variant="labelLarge"
              style={{ color: colors.tertiary, margin: 20 }}
            >
              Team Players
            </Text>
            <TabView
              navigationState={{ index, routes }}
              renderTabBar={renderTabBar}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: windowWidth }}
              swipeEnabled={false}
            />
            <Image
              style={{
                height: 120,
                maxWidth: "100%",
                marginBottom: 20,
              }}
              resizeMode="contain"
              source={require("assets/images/home/basketball-court.png")}
            />
            <View style={{ marginHorizontal: 20, marginBottom: -10 }}>
              {gameDetailsLoading ? (
                <BranchLocationSkeleton />
              ) : (
                <BranchLocation type="court" court={game?.court} pressable />
              )}
            </View>
            <Button
              style={{ marginTop: 20, alignSelf: "center" }}
              icon={"arrow-right-top"}
              onPress={() => {
                const scheme = Platform.select({
                  ios: "maps://0,0?q=",
                  android: "geo:0,0?q=",
                });
                const latLng = `${game?.court.branch.latitude},${game?.court.branch.longitude}`;
                const label = game?.court.branch.venue.name;

                Linking.openURL(
                  Platform.select({
                    ios: `${scheme}${label}@${latLng}`,
                    android: `${scheme}${latLng}(${label})`,
                  })!
                );
              }}
            >
              Get Directions
            </Button>
            <View style={styles.divider} />
            <Text
              variant="labelLarge"
              style={{ color: colors.tertiary, margin: 20 }}
            >
              Updates
            </Text>
            <View style={styles.updatesView}>
              {updatesLoading && <UpdateCardSkeleton />}
              {!updatesLoading && updateCards.map(({ card }) => card)}
            </View>
          </ScrollView>
        </View>
      </AppHeader>
      <BottomModal
        visible={videoFocusVisible !== null}
        setVisible={(value) => {
          if (!value) setVideoFocusVisible(null);
        }}
      >
        <View
          style={{
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <VideoPlayer
            videoProps={{
              source: {
                uri: videoFocusVisible ?? "",
              },
              isLooping: true,
              shouldPlay: true,
              resizeMode: ResizeMode.COVER,
            }}
            style={{
              width: 0.85 * windowWidth,
              height: (0.85 * windowWidth * 9) / 16,
            }}
          />
        </View>
      </BottomModal>
      <AssignPlayer
        playerStatistics={assignPlayerVisible}
        setVisible={setAssignPlayerVisible}
        playerStatus={playerStatus}
        players={players}
        gameId={game?.id}
      />
    </Fragment>
  );
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
      paddingTop: 10,
    },
    tabViewItem: {
      height: 40,
      margin: 5,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    divider: {
      borderColor: colors.secondary,
      borderBottomWidth: 1,
      marginTop: 10,
    },
    updatesView: {
      marginHorizontal: 20,
    },
  });
