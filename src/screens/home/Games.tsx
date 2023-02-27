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
  SportTypeDropdown,
} from "components";
import { BottomTabParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import { UserContext } from "src/utils";
import { useBookingsQuery } from "src/api/queries/games/bookings-query";

type Props = BottomTabScreenProps<BottomTabParamList>;

const GamesIFollow = ({
  navigation,
  route,
  styles,
}: {
  navigation: NavigationProp<BottomTabParamList>;
  route: {
    key: string;
    title: string;
  };
  styles: any;
}) => {
  const { userData }: any = useContext(UserContext);
  const { data: bookings } = useBookingsQuery(userData);

  return (
    <ScrollView>
      <Text variant="labelLarge" style={styles.greyFont}>
        Today
      </Text>
      <Text
        variant="headlineSmall"
        style={{ color: "white", marginTop: -5, marginBottom: 10 }}
      >
        Friday, May 14, 2022
      </Text>

      <View>
        {bookings?.map((booking: any, index: number) => (
          <BookingCard
            key={index}
            inviter={booking.admin?.firstName + " " + booking.admin?.lastName}
            location={booking.court.branch.location}
            gameType={booking.type.toLowerCase()}
            date={booking.date}
            gameDuration={booking.duration}
          />
        ))}
      </View>

      <Text variant="labelLarge" style={styles.greyFont}>
        Tomorrow
      </Text>
      <View>
        {bookings?.map((booking: any, index: number) => (
          <BookingCard
            key={index}
            inviter={booking.admin?.firstName + " " + booking.admin?.lastName}
            location={booking.court.branch.location}
            gameType={booking.type.toLowerCase()}
            date={booking.date}
            gameDuration={booking.duration}
          />
        ))}
      </View>

      <Text variant="labelLarge" style={styles.greyFont}>
        This Sunday
      </Text>
      <View>
        {bookings?.map((booking: any, index: number) => (
          <BookingCard
            key={index}
            inviter={booking.admin?.firstName + " " + booking.admin?.lastName}
            location={booking.court.branch.location}
            gameType={booking.type.toLowerCase()}
            date={booking.date}
            gameDuration={booking.duration}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const PreviousGamesIFollow = ({
  navigation,
  route,
  styles,
}: {
  navigation: NavigationProp<BottomTabParamList>;
  route: {
    key: string;
    title: string;
  };
  styles: any;
}) => {
  const { userData }: any = useContext(UserContext);
  const { data: bookings } = useBookingsQuery(userData);

  return (
    <ScrollView>
      <Text variant="labelLarge" style={styles.greyFont}>
        Today
      </Text>
      <Text
        variant="headlineSmall"
        style={{ color: "white", marginTop: -5, marginBottom: 10 }}
      >
        Friday, May 14, 2022
      </Text>

      <Text variant="labelLarge" style={styles.greyFont}>
        Yesterday
      </Text>
      <View>
        {bookings?.map((booking: any, index: number) => (
          <BookingCard
            key={index}
            inviter={booking.admin?.firstName + " " + booking.admin?.lastName}
            location={booking.court.branch.location}
            gameType={booking.type.toLowerCase()}
            date={booking.date}
            gameDuration={booking.duration}
          />
        ))}
      </View>

      <Text variant="labelLarge" style={styles.greyFont}>
        Last Week
      </Text>
      <View>
        {bookings?.map((booking: any, index: number) => (
          <BookingCard
            key={index}
            inviter={booking.admin?.firstName + " " + booking.admin?.lastName}
            location={booking.court.branch.location}
            gameType={booking.type.toLowerCase()}
            date={booking.date}
            gameDuration={booking.duration}
          />
        ))}
      </View>
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
              styles={styles}
            />
          );
        case "AllGames":
          return (
            <GamesIFollow
              navigation={navigation}
              route={route}
              styles={styles}
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
              styles={styles}
            />
          );
        case "AllGames":
          return (
            <PreviousGamesIFollow
              navigation={navigation}
              route={route}
              styles={styles}
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
      left={<SportTypeDropdown />}
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
    greyFont: { marginVertical: 10, color: colors.tertiary },
  });
