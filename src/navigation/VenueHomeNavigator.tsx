import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { VenueHome } from "screens";
import { VenueBottomTabParamList, tabScreenOptions } from "./tabScreenOptions";
import { HomeStackParamList } from "./AppNavigator";
import * as Location from "expo-location";

const Tab = createBottomTabNavigator<VenueBottomTabParamList>();

const BottomTabNavigator = ({
  setSignedIn,
}: {
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>;
}) => {
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
        <Tab.Screen
          name="Home"
          children={(props) => (
            <VenueHome {...props} setSignedIn={setSignedIn} />
          )}
        />
        <Tab.Screen
          name="Venue"
          children={(props) => (
            <VenueHome {...props} setSignedIn={setSignedIn} />
          )}
        />
      </Tab.Navigator>
    </View>
  );
};

export const VenueHomeNavigator = ({
  setSignedIn,
}: {
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>;
}) => {
  const Stack = createStackNavigator<HomeStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomBar">
        {(props) => <BottomTabNavigator {...props} setSignedIn={setSignedIn} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
