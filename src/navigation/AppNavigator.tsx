import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import {
  useWindowDimensions,
  View,
  Pressable,
  StyleSheet,
  BackHandler,
} from "react-native";
import { NavigatorScreenParams } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, useTheme } from "react-native-paper";
import {
  GameDetails,
  Games,
  Home,
  Play,
  Profile,
  VenueBookingDetails,
  VenueBranches,
  VenueDetails,
  Venues,
} from "screens";
import { SignUpNavigator } from "./SignUpNavigator";
import { BottomTabParamList, tabScreenOptions } from "./tabScreenOptions";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { GameType, VenueBranch } from "src/types";
import { BranchCourts } from "src/screens/home/BranchCourts";
import { ChooseVenue } from "src/screens/home/Play/ChooseVenue";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
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
          children={(props) => <Profile isUserProfile={true} {...props} />}
        />
      </Tab.Navigator>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          alignItems: "center",
          width: "100%",
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

export type HomeStackParamList = {
  BottomBar: NavigatorScreenParams<BottomTabParamList>;
  GameDetails: { id: number };
  VenueDetails: {
    id: number;
    isPlayScreen: boolean;
    playScreenBranch: VenueBranch | null;
    playScreenBookingDetails: {
      date: string;
      duration: number;
      gameType: GameType;
    } | null;
  };
  VenueBookingDetails: {
    venueName: string;
    courtType: string;
    price: number;
    bookingDetails: {
      courtId: number;
      date: string;
      duration: number;
      gameType: GameType;
    };
  };
  VenueBranches: { id: number; venueName: string };
  BranchCourts: {
    venueName: string;
    courts: VenueBranch["courts"];
    branchLocation: string;
    bookingDetails: {
      date: string;
      duration: number;
      gameType: GameType;
    };
  };
  ChooseVenue: {
    location: string;
    date: string;
    duration: number;
    gameType: GameType;
  };
};

const Stack = createStackNavigator<HomeStackParamList>();

export const AppNavigator = () => {
  const [signedIn, setSignedIn] = useState<boolean>(false);

  if (signedIn)
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomBar" component={BottomTabNavigator} />
        <Stack.Screen
          name="VenueBookingDetails"
          component={VenueBookingDetails}
        />
        <Stack.Screen name="GameDetails" component={GameDetails} />
        <Stack.Screen name="VenueDetails" component={VenueDetails} />
        <Stack.Screen name="VenueBranches" component={VenueBranches} />
        <Stack.Screen name="BranchCourts" component={BranchCourts} />
        <Stack.Screen name="ChooseVenue" component={ChooseVenue} />
      </Stack.Navigator>
    );
  else return <SignUpNavigator setSignedIn={setSignedIn} />;
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
