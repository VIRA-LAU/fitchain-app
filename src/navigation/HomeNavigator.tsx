import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
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
  Games,
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
} from "screens";
import { BottomTabParamList, tabScreenOptions } from "./tabScreenOptions";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { StackParamList } from "./Authenticator";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useQueryClient } from "react-query";
import { useNavigationState } from "@react-navigation/native";

const Tab = createBottomTabNavigator<BottomTabParamList>();
type Props = StackScreenProps<StackParamList, "BottomBar">;

var playScreenStillVisible = true;

export const setPlayScreenStillVisible = (value: boolean) => {
  playScreenStillVisible = value;
};

// TODO: Separate bottom tab navigator as a component for reusability
const BottomTabNavigator = ({ navigation, route }: Props) => {
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
            isPrevious: false,
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
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Games" component={Games} />
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
        <Tab.Screen name="Venues" component={Branches} />
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
            setPlayScreenVisible(true);
          }}
        >
          <View style={styles.playIcon}>
            <IonIcon name={"basketball-outline"} size={35} color={"white"} />
          </View>
          <Text style={styles.playText}>Play</Text>
        </TouchableOpacity>
      </View>
      {permissionReady && (
        <Play visible={playScreenVisible} setVisible={setPlayScreenVisible} />
      )}
    </View>
  );
};

export const HomeNavigator = () => {
  const Stack = createStackNavigator<StackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomBar" component={BottomTabNavigator} />
      <Stack.Screen name="BookingPayment" component={BookingPayment} />
      <Stack.Screen name="GameDetails" component={GameDetails} />
      <Stack.Screen name="BranchDetails" component={BranchDetails} />
      <Stack.Screen name="ChooseBranch" component={ChooseBranch} />
      <Stack.Screen name="ChooseCourt" component={ChooseCourt} />
      <Stack.Screen name="ChooseGame" component={ChooseGame} />
      <Stack.Screen name="InviteUsers" component={InviteUsers} />
      <Stack.Screen name="RatePlayer" component={RatePlayer} />
      <Stack.Screen name="PlayerProfile" component={Profile} />
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
      backgroundColor: colors.primary,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    playText: { height: 40, fontSize: 10, color: "white", paddingTop: 12 },
  });
