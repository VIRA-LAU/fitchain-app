import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  useWindowDimensions,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  StackScreenProps,
  createStackNavigator,
} from "@react-navigation/stack";
import { Text, useTheme } from "react-native-paper";
import {
  GameDetails,
  Home,
  InviteUsers,
  Play,
  Profile,
  BookingPayment,
  BranchDetails,
  Branches,
  ChooseCourt,
  ChooseBranch,
  ChooseGame,
  RatePlayer,
  Community,
  Notifications as NotificationsScreen,
  Challenges,
  BookCourt,
} from "screens";
import { BottomTabParamList, tabScreenOptions } from "./tabScreenOptions";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useQueryClient } from "react-query";
import { useNavigationState } from "@react-navigation/native";
import { GameType, TimeSlot } from "src/types";
import { LatLng } from "react-native-maps";
import { NavigatorScreenParams } from "@react-navigation/native";
import { Image } from "react-native";

const Tab = createBottomTabNavigator<BottomTabParamList>();
type Props = StackScreenProps<StackParamList, "BottomBar">;

// TODO: Separate bottom tab navigator as a component for reusability
const BottomTabNavigator = ({
  navigation,
  route,
  playScreenStillVisible,
  setPlayScreenStillVisible,
}: Props & {
  playScreenStillVisible: boolean;
  setPlayScreenStillVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors, useWindowDimensions().width);

  const [playScreenVisible, setPlayScreenVisible] = useState<boolean>(false);
  const [permissionReady, setPermissionReady] = useState<boolean>(false);

  const state = useNavigationState((state) => state.index);

  useEffect(() => {
    if (state === 0 && playScreenStillVisible) setPlayScreenVisible(true);
  }, [state]);

  const queryClient = useQueryClient();

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionReady(true);
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }
    };
    requestLocationPermission();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data.url as string;
        if (url === "home") {
          queryClient.refetchQueries("received-requests");
          queryClient.refetchQueries("invitations");
          navigation.navigate("BottomBar", { screen: "Home" });
        } else if (url.includes("game")) {
          const gameId = parseInt(url.split("/").pop()!);
          navigation.push("GameDetails", {
            id: gameId,
          });
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ height: "100%", position: "relative" }}>
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen
          name="Home"
          children={(props) => (
            <Home {...props} setPlayScreenVisible={setPlayScreenVisible} />
          )}
        />
        <Tab.Screen name="Challenges" component={Challenges} />
        <Tab.Screen
          name="Play"
          component={View}
          options={{
            tabBarLabelStyle: {
              color: "transparent",
            },
            tabBarItemStyle: {
              width: 0,
            },
          }}
        />
        <Tab.Screen name="Community" component={Community} />
        <Tab.Screen
          name="Profile"
          children={(props) => <Profile {...props} isUserProfile />}
        />
      </Tab.Navigator>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          alignItems: "center",
          width: "20%",
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.playIconView}
          onPress={() => {
            // setPlayScreenVisible(true);
            navigation.push("BookCourt");
          }}
        >
          <View style={styles.playIcon}>
            {/* <IonIcon name={"basketball-outline"} size={35} color={colors.tertiary} /> */}
            <Image
              source={require("assets/images/logo-white.png")}
              resizeMode="contain"
              style={{ width: "65%" }}
            />
          </View>
          <Text style={styles.playText}>Play</Text>
        </TouchableOpacity>
      </View>
      {permissionReady && (
        <Play
          visible={playScreenVisible}
          setVisible={setPlayScreenVisible}
          setPlayScreenStillVisible={setPlayScreenStillVisible}
        />
      )}
    </View>
  );
};

export type StackParamList = {
  BottomBar: NavigatorScreenParams<BottomTabParamList>;
  BookCourt: undefined;
  GameDetails: { id: number };
  InviteUsers: {
    gameId: number;
  };
  PlayerProfile: {
    playerId: number;
    firstName: string;
    lastName: string;
  };
  RatePlayer: {
    playerId: number;
    firstName: string;
    lastName: string;
    gameId: number;
    profilePhotoUrl?: string;
    coverPhotoUrl?: string;
  };
  Branches: undefined;
  BranchDetails: {
    id: number;
    playScreenBookingDetails?: {
      date: string;
      nbOfPlayers: number;
      time?: TimeSlot;
      gameType: GameType;
    } | null;
  };
  ChooseBranch: {
    gameType: GameType;
    nbOfPlayers: number;
    date: string;
    location: LatLng;
    locationName: string;
    time?: TimeSlot;
  };
  ChooseCourt: {
    venueName?: string;
    branchId: number;
    branchLocation?: string;
    bookingDetails?: {
      date: string;
      nbOfPlayers: number;
      gameType: GameType;
      time?: TimeSlot;
    };
    profilePhotoUrl?: string;
  };
  BookingPayment: {
    venueName: string;
    courtName: string;
    courtType: string;
    courtRating: number;
    courtMaxPlayers: number;
    price: number;
    branchLatLng: number[];
    bookingDetails: {
      courtId: number;
      date: string;
      nbOfPlayers: number;
      time: TimeSlot;
      gameType: GameType;
    };
    profilePhotoUrl?: string;
  };
  ChooseGame: {
    gameType: GameType;
    location: LatLng;
    locationName: string;
    nbOfPlayers: number;
    date?: string;
    time?: TimeSlot;
  };
  Notifications: undefined;
};

export const HomeNavigator = () => {
  const Stack = createStackNavigator<StackParamList>();
  const [playScreenStillVisible, setPlayScreenStillVisible] =
    useState<boolean>(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomBar">
        {(props) => (
          <BottomTabNavigator
            {...props}
            playScreenStillVisible={playScreenStillVisible}
            setPlayScreenStillVisible={setPlayScreenStillVisible}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="BookingPayment">
        {(props) => (
          <BookingPayment
            {...props}
            setPlayScreenStillVisible={setPlayScreenStillVisible}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Branches" component={Branches} />
      <Stack.Screen name="GameDetails" component={GameDetails} />
      <Stack.Screen name="BranchDetails" component={BranchDetails} />
      <Stack.Screen name="ChooseBranch" component={ChooseBranch} />
      <Stack.Screen name="ChooseCourt" component={ChooseCourt} />
      <Stack.Screen name="ChooseGame" component={ChooseGame} />
      <Stack.Screen name="InviteUsers" component={InviteUsers} />
      <Stack.Screen name="RatePlayer" component={RatePlayer} />
      <Stack.Screen name="PlayerProfile" component={Profile} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="BookCourt" component={BookCourt} />
    </Stack.Navigator>
  );
};

const makeStyles = (colors: MD3Colors, windowWidth: number) =>
  StyleSheet.create({
    playIconView: {
      width: windowWidth / 5,
      justifyContent: "center",
      alignItems: "center",
    },
    playIcon: {
      width: windowWidth / 5.5,
      aspectRatio: 1,
      backgroundColor: colors.tertiary,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    playText: {
      height: 40,
      fontSize: 10,
      color: colors.tertiary,
      paddingTop: 12,
      fontFamily: "Poppins-Medium",
    },
  });
