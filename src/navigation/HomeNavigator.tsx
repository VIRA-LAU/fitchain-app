import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  useWindowDimensions,
  View,
  Pressable,
  StyleSheet,
  BackHandler,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, useTheme } from "react-native-paper";
import {
  GameDetails,
  Games,
  Home,
  InviteUsers,
  Play,
  Profile,
  VenueBookingDetails,
  VenueBranches,
  VenueDetails,
  Venues,
  BranchCourts,
  ChooseVenue,
  ChooseGame,
  RatePlayer,
} from "screens";
import { BottomTabParamList, tabScreenOptions } from "./tabScreenOptions";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { HomeStackParamList } from "./AppNavigator";
import * as Location from "expo-location";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = ({
  setSignedIn,
}: {
  setSignedIn: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors, useWindowDimensions().width);
  const [playScreenVisible, setPlayScreenVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleBack = () => {
      if (playScreenVisible) {
        setPlayScreenVisible(false);
        return true;
      } else return false;
    };
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, [playScreenVisible]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }
    };
    requestLocationPermission();
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
        <Tab.Screen name="Venues" component={Venues} />
        <Tab.Screen
          name="Profile"
          children={(props) => (
            <Profile
              isUserProfile={true}
              setSignedIn={setSignedIn}
              {...props}
            />
          )}
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
        <Pressable
          style={styles.playIconView}
          onPress={() => {
            setPlayScreenVisible(true);
          }}
        >
          <View style={styles.playIcon}>
            <IonIcon name={"basketball-outline"} size={35} color={"white"} />
          </View>
          <Text style={styles.playText}>Play</Text>
        </Pressable>
      </View>
      <Play visible={playScreenVisible} setVisible={setPlayScreenVisible} />
    </View>
  );
};

export const HomeNavigator = ({
  setSignedIn,
}: {
  setSignedIn: Dispatch<SetStateAction<boolean>>;
}) => {
  const Stack = createStackNavigator<HomeStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomBar">
        {(props) => <BottomTabNavigator {...props} setSignedIn={setSignedIn} />}
      </Stack.Screen>
      <Stack.Screen
        name="VenueBookingDetails"
        component={VenueBookingDetails}
      />
      <Stack.Screen name="GameDetails" component={GameDetails} />
      <Stack.Screen name="VenueDetails" component={VenueDetails} />
      <Stack.Screen name="VenueBranches" component={VenueBranches} />
      <Stack.Screen name="BranchCourts" component={BranchCourts} />
      <Stack.Screen name="ChooseVenue" component={ChooseVenue} />
      <Stack.Screen name="ChooseGame" component={ChooseGame} />
      <Stack.Screen name="InviteUsers" component={InviteUsers} />
      <Stack.Screen name="RatePlayer" component={RatePlayer} />
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
