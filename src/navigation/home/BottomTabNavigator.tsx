import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import {
  useWindowDimensions,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { Text, useTheme } from "react-native-paper";
import { Home, Profile, Community, Challenges } from "screens";
import { BottomTabParamList, tabScreenOptions } from "../tabScreenOptions";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useQueryClient } from "react-query";
import { Image } from "react-native";
import { HomeStackParamList } from "./HomeStackNavigator";

const Tab = createBottomTabNavigator<BottomTabParamList>();
type Props = StackScreenProps<HomeStackParamList, "BottomBar">;

export const BottomTabNavigator = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors, useWindowDimensions().width);

  const queryClient = useQueryClient();

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
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
        <Tab.Screen name="Home" component={Home} />
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
            navigation.push("CreateGame", {});
          }}
        >
          <View style={styles.playIcon}>
            <Image
              source={require("assets/images/logo-white.png")}
              resizeMode="contain"
              style={{ width: "65%" }}
            />
          </View>
          <Text style={styles.playText}>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
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
