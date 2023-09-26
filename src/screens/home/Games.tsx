import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { TabBar, TabView } from "react-native-tab-view";
import {
  AppHeader,
  BookingCard,
  BookingCardSkeleton,
  GameTimeDropdown,
  SportSelection,
  SportTypeDropdown,
} from "components";
import { BottomTabParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import {
  useBookingsQuery,
  useFollowedGamesQuery,
  useGamesQuery,
} from "src/api";
import { Game } from "src/types";
import { QueryObserverResult } from "react-query";

type NavigationProps = BottomTabScreenProps<BottomTabParamList>;

type GameListProps = {
  selectedSports: SportSelection;
  type: "upcoming" | "previous";
  isFollowedGames: boolean;
  searchBarText: string;
};

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

const AllGames = (props: GameListProps) => {
  const {
    data: allGames,
    refetch,
    isFetching,
    isLoading,
  } = useBookingsQuery({ type: props.type });
  return (
    <GameList
      {...props}
      games={allGames}
      isFollowed={false}
      refetch={refetch}
      isFetching={isFetching}
      isLoading={isLoading}
    />
  );
};

const FollowedGames = (props: GameListProps) => {
  const {
    data: followedGames,
    refetch: refetchFollowedGames,
    isFetching: followedGamesFetching,
    isLoading: followedGamesLoading,
  } = useFollowedGamesQuery({ type: props.type });
  const {
    data: myGames,
    refetch: refetchGames,
    isFetching: gamesFetching,
    isLoading: gamesLoading,
  } = useGamesQuery({ type: props.type });

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
      props.type === "upcoming"
        ? a.startTime.getTime() - b.startTime.getTime()
        : b.startTime.getTime() - a.startTime.getTime()
    );
  }, [JSON.stringify(followedGames), JSON.stringify(myGames)]);

  return (
    <GameList
      {...props}
      games={games}
      isFollowed={true}
      refetch={refetch}
      isFetching={gamesFetching || followedGamesFetching}
      isLoading={gamesLoading || followedGamesLoading}
    />
  );
};

const GameList = ({
  selectedSports,
  type,
  searchBarText,
  games,
  isFollowed,
  refetch,
  isFetching,
  isLoading,
}: GameListProps & {
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

  const filteredGames = games?.filter((game) => {
    const s = searchBarText.toLowerCase().trim();
    return (
      selectedSports[game.type] &&
      (game.admin.firstName.toLowerCase().includes(s) ||
        game.admin.lastName.toLowerCase().includes(s) ||
        `${game.admin.firstName.toLowerCase()} ${game.admin.lastName.toLowerCase()}`.includes(
          s
        ) ||
        game.court.branch.location.toLowerCase().includes(s) ||
        game.court.branch.venue.name.toLowerCase().includes(s) ||
        game.type.toLowerCase().includes(s))
    );
  });

  if (type === "upcoming")
    filteredGames?.forEach((game: Game, index: number) => {
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
    filteredGames?.forEach((game: Game, index: number) => {
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
      contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
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

export const Games = ({ navigation, route }: NavigationProps) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const windowWidth = useWindowDimensions().width;

  const [index, setIndex] = useState(0);
  const [durationIndex, setDurationIndex] = useState(0);
  const [routes] = useState([
    { key: "GamesIFollow", title: "Games I Follow" },
    { key: "AllGames", title: "All Games" },
  ]);

  const [selectedSports, setSelectedSports] = useState({
    Basketball: true,
    Football: true,
    Tennis: true,
  });

  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchBarText, setSearchBarText] = useState<string>("");

  const renderScene = () => {
    const route = routes[index];
    switch (route.key) {
      case "GamesIFollow":
        return (
          <FollowedGames
            type={durationIndex === 0 ? "upcoming" : "previous"}
            selectedSports={selectedSports}
            isFollowedGames={true}
            searchBarText={searchBarText}
          />
        );
      case "AllGames":
        return (
          <AllGames
            type={durationIndex === 0 ? "upcoming" : "previous"}
            selectedSports={selectedSports}
            isFollowedGames={false}
            searchBarText={searchBarText}
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
                fontFamily: isActive ? "Poppins-Bold" : "Poppins-Regular",
                color: colors.tertiary,
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
    <AppHeader
      absolutePosition={false}
      right={
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setSearchBarVisible(true);
          }}
        >
          <IonIcon name="search-outline" color={colors.tertiary} size={24} />
        </TouchableOpacity>
      }
      middle={
        <GameTimeDropdown index={durationIndex} setIndex={setDurationIndex} />
      }
      // left={
      //   <SportTypeDropdown
      //     selectedSports={selectedSports}
      //     setSelectedSports={setSelectedSports}
      //   />
      // }
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
    tabViewItem: {
      height: 40,
      margin: 5,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
  });
