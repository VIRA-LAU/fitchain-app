import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import {
  AppHeader,
  BookingCard,
  BookingCardSkeleton,
  GameTimeDropdown,
  SportSelection,
} from "components";
import {
  useBookingsQuery,
  useFollowedGamesQuery,
  useGamesQuery,
} from "src/api";
import { Game } from "src/types";
import { QueryObserverResult } from "react-query";
import FeatherIcon from "react-native-vector-icons/Feather";

export const DayHeader = ({ day }: { day: string }) => {
  const { colors } = useTheme();
  return (
    <Text
      variant="labelLarge"
      style={{ marginVertical: 16, color: colors.tertiary }}
    >
      {day}
    </Text>
  );
};

const AllGames = ({ type }: { type: "upcoming" | "previous" }) => {
  const {
    data: allGames,
    refetch,
    isFetching,
    isLoading,
  } = useBookingsQuery({ type });
  return (
    <GameList
      type={type}
      games={allGames}
      isFollowed={false}
      refetch={refetch}
      isFetching={isFetching}
      isLoading={isLoading}
    />
  );
};

const MyGames = ({ type }: { type: "upcoming" | "previous" }) => {
  const {
    data: myGames,
    refetch: refetchGames,
    isFetching: gamesFetching,
    isLoading: gamesLoading,
  } = useGamesQuery({ type });

  const games = useMemo(() => {
    let games: Game[] = [];
    if (myGames) games = games.concat(myGames);
    return games.sort((a, b) =>
      type === "upcoming"
        ? a.startTime.getTime() - b.startTime.getTime()
        : b.startTime.getTime() - a.startTime.getTime()
    );
  }, [JSON.stringify(myGames)]);

  return (
    <GameList
      type={type}
      games={games}
      isFollowed={false}
      refetch={refetchGames}
      isFetching={gamesFetching}
      isLoading={gamesLoading}
    />
  );
};

const FollowedGames = ({ type }: { type: "upcoming" | "previous" }) => {
  const {
    data: followedGames,
    refetch: refetchFollowedGames,
    isFetching: followedGamesFetching,
    isLoading: followedGamesLoading,
  } = useFollowedGamesQuery({ type });
  const {
    data: myGames,
    refetch: refetchGames,
    isFetching: gamesFetching,
    isLoading: gamesLoading,
  } = useGamesQuery({ type });

  const refetch = () => {
    refetchGames();
    refetchFollowedGames();
  };

  const games = useMemo(() => {
    let games: Game[] = [];
    if (followedGames) games = games.concat(followedGames);
    if (myGames) games = games.concat(myGames);
    games = games.filter((game, index) => {
      return index === games.findIndex((otherGame) => otherGame.id === game.id);
    });
    return games.sort((a, b) =>
      type === "upcoming"
        ? a.startTime.getTime() - b.startTime.getTime()
        : b.startTime.getTime() - a.startTime.getTime()
    );
  }, [JSON.stringify(followedGames), JSON.stringify(myGames)]);

  return (
    <GameList
      type={type}
      games={games}
      isFollowed={true}
      refetch={refetch}
      isFetching={gamesFetching || followedGamesFetching}
      isLoading={gamesLoading || followedGamesLoading}
    />
  );
};

const GameList = ({
  type,
  games,
  isFollowed,
  refetch,
  isFetching,
  isLoading,
}: {
  type: "upcoming" | "previous";
  games?: Game[];
  isFollowed: boolean;
  refetch: (() => Promise<QueryObserverResult<Game[], unknown>>) | (() => void);
  isFetching: boolean;
  isLoading: boolean;
}) => {
  const { colors } = useTheme();
  const today = new Date();
  const gameCards: JSX.Element[] = [];
  const dayHeaders: string[] = [];

  if (type === "upcoming")
    games?.forEach((game: Game, index: number) => {
      const gameDate = new Date(
        game.startTime
          .toISOString()
          .substring(0, game.startTime.toISOString().indexOf("T"))
      );
      const todayDate = new Date(
        today.toISOString().substring(0, today.toISOString().indexOf("T"))
      );
      const dayDiff =
        (gameDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1 && !dayHeaders.includes("tomorrow")) {
        dayHeaders.push("tomorrow");
        gameCards.push(<DayHeader key={"tomorrow"} day="Tomorrow" />);
      } else if (
        dayDiff > 1 &&
        dayDiff <= 7 &&
        !dayHeaders.includes("this-week")
      ) {
        dayHeaders.push("this-week");
        gameCards.push(<DayHeader key={"this-week"} day="This Week" />);
      } else if (
        dayDiff > 7 &&
        dayDiff <= 30 &&
        !dayHeaders.includes("this-month")
      ) {
        dayHeaders.push("this-month");
        gameCards.push(<DayHeader key={"this-month"} day="This Month" />);
      } else if (dayDiff > 30 && !dayHeaders.includes("future")) {
        dayHeaders.push("future");
        gameCards.push(<DayHeader key={"future"} day="In the Future" />);
      }

      gameCards.push(
        <BookingCard key={index} booking={game} isPrevious={false} />
      );
    });
  else
    games?.forEach((game: Game, index: number) => {
      const gameDate = new Date(
        game.startTime
          .toISOString()
          .substring(0, game.startTime.toISOString().indexOf("T"))
      );
      const todayDate = new Date(
        today.toISOString().substring(0, today.toISOString().indexOf("T"))
      );
      const dayDiff =
        -(gameDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1 && !dayHeaders.includes("yesterday")) {
        dayHeaders.push("yesterday");
        gameCards.push(<DayHeader key={"yesterday"} day="Yesterday" />);
      } else if (
        dayDiff > 1 &&
        dayDiff <= 7 &&
        !dayHeaders.includes("last-week")
      ) {
        dayHeaders.push("last-week");
        gameCards.push(<DayHeader key={"last-week"} day="Last Week" />);
      } else if (
        dayDiff > 7 &&
        dayDiff <= 30 &&
        !dayHeaders.includes("last-month")
      ) {
        dayHeaders.push("last-month");
        gameCards.push(<DayHeader key={"last-month"} day="Last Month" />);
      } else if (dayDiff > 30 && !dayHeaders.includes("past")) {
        dayHeaders.push("past");
        gameCards.push(<DayHeader key={"past"} day="In the Past" />);
      }

      gameCards.push(<BookingCard key={index} booking={game} isPrevious />);
    });

  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (!isFetching) setRefreshing(false);
  }, [isFetching]);

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          progressBackgroundColor={colors.secondary}
        />
      }
    >
      <DayHeader day="Today" />
      <Text
        variant="headlineSmall"
        style={{
          color: colors.tertiary,
          marginTop: -5,
          marginBottom: 10,
        }}
      >
        {today.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
      {isLoading && <BookingCardSkeleton />}
      {!isLoading && gameCards}
      {!isLoading && gameCards.length === 0 && (
        <View
          style={{
            height: 100,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              color: colors.tertiary,
              textAlign: "center",
            }}
          >
            You have no {type} {isFollowed && "followed "}games.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const durations = ["Upcoming Games", "Previous Games"];

export const Games = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const windowWidth = useWindowDimensions().width;

  const [index, setIndex] = useState(0);
  const [durationIndex, setDurationIndex] = useState(0);
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [routes] = useState([
    { key: "mine", title: "My Games" },
    { key: "followed", title: "Followed" },
    { key: "all", title: "All Games" },
  ]);

  const type = durationIndex === 0 ? "upcoming" : "previous";

  const renderScene = SceneMap({
    mine: () => <MyGames type={type} />,
    followed: () => <FollowedGames type={type} />,
    all: () => <AllGames type={type} />,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: colors.secondary,
        borderRadius: 10,
        marginHorizontal: 16,
      }}
      contentContainerStyle={{ gap: 3 }}
      renderTabBarItem={({ route }) => {
        let isActive = route.key === props.navigationState.routes[index].key;
        return (
          <TouchableRipple
            key={route.key}
            borderless
            style={{
              borderRadius: 10,
            }}
            onPress={() => {
              setIndex(routes.findIndex(({ key }) => route.key === key));
            }}
          >
            <View
              style={[
                styles.tabViewItem,
                {
                  backgroundColor: isActive ? colors.primary : colors.secondary,
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: isActive ? "Poppins-Bold" : "Poppins-Regular",
                  color: isActive ? colors.background : colors.tertiary,
                }}
              >
                {route.title}
              </Text>
            </View>
          </TouchableRipple>
        );
      }}
      renderIndicator={() => <View style={{ width: 0 }} />}
    />
  );

  return (
    <AppHeader
      absolutePosition={false}
      middle={
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => setDurationModalVisible(!durationModalVisible)}
        >
          <Text style={styles.title}>{durations[durationIndex]}</Text>
          <FeatherIcon
            name={`chevron-${durationModalVisible ? "up" : "down"}`}
            color={colors.tertiary}
            size={24}
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
      }
      backEnabled
    >
      <View style={styles.wrapperView}>
        <TabView
          navigationState={{ index, routes }}
          renderTabBar={renderTabBar}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: windowWidth }}
          swipeEnabled={false}
        />
      </View>
      <GameTimeDropdown
        durations={durations}
        index={durationIndex}
        setIndex={setDurationIndex}
        modalVisible={durationModalVisible}
        setModalVisible={setDurationModalVisible}
      />
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flex: 1,
      paddingTop: 10,
      backgroundColor: colors.background,
    },
    title: {
      color: colors.tertiary,
      fontFamily: "Poppins-Bold",
    },
    tabViewItem: {
      height: 40,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      width: (Dimensions.get("screen").width - 32 - 6) / 3,
    },
  });
