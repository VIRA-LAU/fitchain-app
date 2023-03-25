import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  RefreshControl,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { TabBar, TabBarProps, TabView } from "react-native-tab-view";
import {
  AppHeader,
  BookingCard,
  DurationDropdown,
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
type Props = {
  selectedSports: SportSelection;
  type: "upcoming" | "previous";
  isFollowedGames: boolean;
};

const DayHeader = ({ day }: { day: string }) => {
  const { colors } = useTheme();
  return (
    <Text
      variant="labelLarge"
      style={{ marginVertical: 10, color: colors.tertiary }}
    >
      {day}
    </Text>
  );
};

const AllGames = (props: Props) => {
  const {
    data: allGames,
    refetch,
    isFetching,
  } = useBookingsQuery({ type: props.type });
  return (
    <GameList
      {...props}
      games={allGames}
      isFollowed={false}
      refetch={refetch}
      isFetching={isFetching}
    />
  );
};

const FollowedGames = (props: Props) => {
  const {
    data: followedGames,
    refetch: refetchFollowedGames,
    isFetching: followedGamesFetching,
  } = useFollowedGamesQuery({ type: props.type });
  const {
    data: myGames,
    refetch: refetchGames,
    isFetching: gamesFetching,
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
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime()
    );
  }, [JSON.stringify(followedGames), JSON.stringify(myGames)]);

  return (
    <GameList
      {...props}
      games={games}
      isFollowed={true}
      refetch={refetch}
      isFetching={gamesFetching || followedGamesFetching}
    />
  );
};

const GameList = ({
  selectedSports,
  type,
  games,
  isFollowed,
  refetch,
  isFetching,
}: Props & {
  games?: Game[];
  isFollowed: boolean;
  refetch: (() => Promise<QueryObserverResult<Game[], unknown>>) | (() => void);
  isFetching: boolean;
}) => {
  const { colors } = useTheme();
  const today = new Date();
  const gameCards: JSX.Element[] = [];
  const dayHeaders: string[] = [];

  if (type === "upcoming")
    games
      ?.filter((game) => selectedSports[game.type])
      .forEach((game: Game, index: number) => {
        const gameDate = new Date(
          game.date
            .toISOString()
            .substring(0, game.date.toISOString().indexOf("T"))
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

        gameCards.push(<BookingCard key={index} booking={game} />);
      });
  else
    games
      ?.filter((game) => selectedSports[game.type])
      .forEach((game: Game, index: number) => {
        const gameDate = new Date(
          game.date
            .toISOString()
            .substring(0, game.date.toISOString().indexOf("T"))
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

        gameCards.push(<BookingCard key={index} booking={game} />);
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
          color: "white",
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
      {gameCards}
      {gameCards.length === 0 && (
        <Text
          style={{
            height: 100,
            fontFamily: "Inter-Medium",
            color: colors.tertiary,
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          You have no {type} {isFollowed && "followed "}games.
        </Text>
      )}
    </ScrollView>
  );
};

export const Games = ({ navigation, route }: NavigationProps) => {
  const [index, setIndex] = useState(0);
  const [durationIndex, setDurationIndex] = useState(0);
  const [routes] = useState([
    { key: "GamesIFollow", title: "Games I Follow" },
    { key: "AllGames", title: "All Games" },
  ]);

  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const windowWidth = useWindowDimensions().width;

  const [selectedSports, setSelectedSports] = useState({
    Basketball: true,
    Football: true,
    Tennis: true,
  });

  const renderScene = () => {
    const route = routes[index];
    switch (route.key) {
      case "GamesIFollow":
        return (
          <FollowedGames
            type={durationIndex === 0 ? "upcoming" : "previous"}
            selectedSports={selectedSports}
            isFollowedGames={true}
          />
        );
      case "AllGames":
        return (
          <AllGames
            type={durationIndex === 0 ? "upcoming" : "previous"}
            selectedSports={selectedSports}
            isFollowedGames={false}
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
      }}
      renderTabBarItem={({ route }) => {
        let isActive = route.key === props.navigationState.routes[index].key;
        return (
          <Pressable
            style={[
              styles.tabViewItem,
              {
                width: 0.5 * (windowWidth - 40 - 20),
                backgroundColor: isActive
                  ? colors.background
                  : colors.secondary,
              },
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
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      right={<IonIcon name="search-outline" color="white" size={24} />}
      middle={
        <DurationDropdown index={durationIndex} setIndex={setDurationIndex} />
      }
      left={
        <SportTypeDropdown
          selectedSports={selectedSports}
          setSelectedSports={setSelectedSports}
        />
      }
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
