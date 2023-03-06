import { useState, useMemo, useContext } from "react";
import { AppHeader } from "src/components";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";
import {
  SceneRendererProps,
  TabBar,
  TabBarProps,
  TabView,
} from "react-native-tab-view";
import { Home } from "./Home";
import { Booking, GameType } from "src/types";
import { useJoinGameMutation } from "src/api";
import { UserContext } from "src/utils";

type Props = StackScreenProps<HomeStackParamList, "GameDetails">;

export const GameDetails = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const windowWidth = useWindowDimensions().width;

  const { booking: bookingString } = route.params;
  const booking: Booking = JSON.parse(bookingString);
  booking.date = new Date(booking.date);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Home", title: "Home" },
    { key: "Away", title: "Away" },
  ]);

  const dateHeader = useMemo(() => {
    const bookingDate = new Date(
      booking.date
        .toISOString()
        .substring(0, booking.date.toISOString().indexOf("T"))
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
  }, []);

  const endTime = new Date(
    booking.date.getTime() + booking.duration * 60 * 1000
  );
  const durationTimeFormatter = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric",
  });
  const startTimeString = durationTimeFormatter.format(booking.date);
  const endTimeString = durationTimeFormatter.format(endTime);

  const renderScene = ({
    route,
  }: SceneRendererProps & {
    route: {
      key: string;
      title: string;
    };
  }) => {
    switch (route.key) {
      case "Home":
        return <Home booking={booking} />;
      case "Away":
        return <Home booking={booking} />;
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
        marginBottom: 10,
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

  const [joinDisabled, setJoinDisabled] = useState(false);
  // const {data: isInGame} = useCheckInGameQuery(booking.id)

  const { userData } = useContext(UserContext);
  const { mutate: joinGame } = useJoinGameMutation(setJoinDisabled);
  return (
    <AppHeader
      absolutePosition={false}
      backEnabled
      title={booking.type}
      right={<IonIcon name="ellipsis-horizontal" color={"black"} size={24} />}
      backgroundImage={booking.type}
      navigation={navigation}
      route={route}
      darkMode
    >
      <View style={styles.wrapperView}>
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
              {booking.date
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
              {startTimeString} - {endTimeString}
            </Text>
          </View>

          <View style={styles.buttonsView}>
            <Button
              icon={() => (
                <IonIcon
                  name={"basketball-outline"}
                  size={26}
                  color={colors.secondary}
                />
              )}
              style={{ borderRadius: 5, flex: 1 }}
              textColor={colors.secondary}
              buttonColor={joinDisabled ? colors.tertiary : colors.primary}
              onPress={() => {
                joinGame({
                  gameId: booking.id,
                  team: "HOME",
                });
              }}
              disabled={joinDisabled}
            >
              Join Game
            </Button>
            <Button
              icon={() => (
                <FeatherIcon name="thumbs-up" size={22} color={"white"} />
              )}
              style={{ borderRadius: 5, flex: 1 }}
              textColor={"white"}
              buttonColor={"transparent"}
            >
              Follow Game
            </Button>
          </View>
        </View>
        <View style={styles.contentView}>
          <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: windowWidth }}
          />
        </View>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flex: 1,
    },
    headerView: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: colors.secondary,
    },
    greyFont: { marginVertical: 10, color: colors.tertiary },
    buttonsView: {
      flexDirection: "row",
      marginTop: 15,
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
