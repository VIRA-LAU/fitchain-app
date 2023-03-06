import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigationProp } from "@react-navigation/native";
import React, { useState, useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  SceneRendererProps,
  TabBar,
  TabBarProps,
  TabView,
} from "react-native-tab-view";
import {
  AppHeader,
  BookingCard,
  DurationDropdown,
  SportSelection,
  SportTypeDropdown,
} from "components";
import { BottomTabParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import { UserContext, UserData } from "src/utils";
import { useBookingsQuery } from "src/api";
import { Booking, GameType } from "src/types";

type Props = BottomTabScreenProps<BottomTabParamList>;

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

const GamesIFollow = ({
  navigation,
  route,
  selectedSports,
}: {
  navigation: NavigationProp<BottomTabParamList>;
  route: {
    key: string;
    title: string;
  };
  selectedSports: SportSelection;
}) => {
  const { userData } = useContext(UserContext);
  const { data: bookings } = useBookingsQuery(userData!);
  const today = new Date();
  const upcomingGames: JSX.Element[] = [];
  const dayHeaders: string[] = [];

  bookings
    ?.filter((booking: Booking) => {
      const bookingDate = new Date(
        booking.date
          .toISOString()
          .substring(0, booking.date.toISOString().indexOf("T"))
      );
      const todayDate = new Date(
        today.toISOString().substring(0, today.toISOString().indexOf("T"))
      );
      return (
        (bookingDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24) >=
          0 && selectedSports[booking.type]
      );
    })
    .forEach((booking: Booking, index: number) => {
      const bookingDate = new Date(
        booking.date
          .toISOString()
          .substring(0, booking.date.toISOString().indexOf("T"))
      );
      const todayDate = new Date(
        today.toISOString().substring(0, today.toISOString().indexOf("T"))
      );
      const dayDiff =
        (bookingDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1 && !dayHeaders.includes("tomorrow")) {
        dayHeaders.push("tomorrow");
        upcomingGames.push(<DayHeader key={"tomorrow"} day="Tomorrow" />);
      } else if (
        dayDiff > 1 &&
        dayDiff <= 7 &&
        !dayHeaders.includes("this-week")
      ) {
        dayHeaders.push("this-week");
        upcomingGames.push(<DayHeader key={"this-week"} day="This Week" />);
      } else if (
        dayDiff > 7 &&
        dayDiff <= 30 &&
        !dayHeaders.includes("this-month")
      ) {
        dayHeaders.push("this-month");
        upcomingGames.push(<DayHeader key={"this-month"} day="This Month" />);
      } else if (dayDiff > 30 && !dayHeaders.includes("future")) {
        dayHeaders.push("future");
        upcomingGames.push(<DayHeader key={"future"} day="In the Future" />);
      }

      upcomingGames.push(<BookingCard key={index} booking={booking} />);
    });

  return (
    <ScrollView>
      <DayHeader day="Today" />
      <Text
        variant="headlineSmall"
        style={{ color: "white", marginTop: -5, marginBottom: 10 }}
      >
        {today.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
      {upcomingGames}
    </ScrollView>
  );
};

const PreviousGamesIFollow = ({
  navigation,
  route,
  selectedSports,
}: {
  navigation: NavigationProp<BottomTabParamList>;
  route: {
    key: string;
    title: string;
  };
  selectedSports: SportSelection;
}) => {
  const { userData } = useContext(UserContext);
  const { data: bookings } = useBookingsQuery(userData!);

  const today = new Date();
  const previousGames: JSX.Element[] = [];
  const dayHeaders: string[] = [];

  bookings
    ?.filter((booking: Booking) => {
      const bookingDate = new Date(
        booking.date
          .toISOString()
          .substring(0, booking.date.toISOString().indexOf("T"))
      );
      const todayDate = new Date(
        today.toISOString().substring(0, today.toISOString().indexOf("T"))
      );
      return (
        (bookingDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24) <
          0 && selectedSports[booking.type]
      );
    })
    .reverse()
    .forEach((booking: Booking, index: number) => {
      const bookingDate = new Date(
        booking.date
          .toISOString()
          .substring(0, booking.date.toISOString().indexOf("T"))
      );
      const todayDate = new Date(
        today.toISOString().substring(0, today.toISOString().indexOf("T"))
      );
      const dayDiff =
        -(bookingDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24);

      if (dayDiff === 1 && !dayHeaders.includes("yesterday")) {
        dayHeaders.push("yesterday");
        previousGames.push(<DayHeader key={"yesterday"} day="Yesterday" />);
      } else if (
        dayDiff > 1 &&
        dayDiff <= 7 &&
        !dayHeaders.includes("last-week")
      ) {
        dayHeaders.push("last-week");
        previousGames.push(<DayHeader key={"last-week"} day="Last Week" />);
      } else if (
        dayDiff > 7 &&
        dayDiff <= 30 &&
        !dayHeaders.includes("last-month")
      ) {
        dayHeaders.push("last-month");
        previousGames.push(<DayHeader key={"last-month"} day="Last Month" />);
      } else if (dayDiff > 30 && !dayHeaders.includes("past")) {
        dayHeaders.push("past");
        previousGames.push(<DayHeader key={"past"} day="In the Past" />);
      }

      previousGames.push(<BookingCard key={index} booking={booking} />);
    });

  return (
    <ScrollView>
      <DayHeader day="Today" />
      <Text
        variant="headlineSmall"
        style={{ color: "white", marginTop: -5, marginBottom: 10 }}
      >
        {today.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>

      {previousGames}
    </ScrollView>
  );
};

export const Games = ({ navigation, route }: Props) => {
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

  const renderScene = ({
    route,
  }: SceneRendererProps & {
    route: {
      key: string;
      title: string;
    };
  }) => {
    if (durationIndex === 0)
      switch (route.key) {
        case "GamesIFollow":
          return (
            <GamesIFollow
              navigation={navigation}
              route={route}
              selectedSports={selectedSports}
            />
          );
        case "AllGames":
          return (
            <GamesIFollow
              navigation={navigation}
              route={route}
              selectedSports={selectedSports}
            />
          );
        default:
          return null;
      }
    else
      switch (route.key) {
        case "GamesIFollow":
          return (
            <PreviousGamesIFollow
              navigation={navigation}
              route={route}
              selectedSports={selectedSports}
            />
          );
        case "AllGames":
          return (
            <PreviousGamesIFollow
              navigation={navigation}
              route={route}
              selectedSports={selectedSports}
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
      }}
      renderTabBarItem={({ route }) => {
        let isActive = route.key === props.navigationState.routes[index].key;
        return (
          <View
            style={[
              styles.tabViewItem,
              {
                width: 0.5 * (windowWidth - 40 - 20),
                backgroundColor: isActive
                  ? colors.background
                  : colors.secondary,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "Inter-Medium",
                color: isActive ? "white" : colors.tertiary,
              }}
            >
              {route.title}
            </Text>
          </View>
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
      paddingHorizontal: 20,
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
