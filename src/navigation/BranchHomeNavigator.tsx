import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { BranchHome, BranchManagement, CreateCourt } from "screens";
import { VenueBottomTabParamList, tabScreenOptions } from "./tabScreenOptions";
import { HomeStackParamList } from "./AppNavigator";
import * as Location from "expo-location";

const Tab = createBottomTabNavigator<VenueBottomTabParamList>();

const BottomTabNavigator = ({
  setSignedIn,
}: {
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>;
}) => {
  const [createCourtVisible, setCreateCourtVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleBack = () => {
      if (createCourtVisible) {
        setCreateCourtVisible(false);
        return true;
      } else return false;
    };
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, [createCourtVisible]);

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
          children={(props) => <BranchHome {...props} />}
        />
        <Tab.Screen
          name="Branch"
          children={(props) => (
            <BranchManagement
              {...props}
              setSignedIn={setSignedIn}
              setCreateCourtVisible={setCreateCourtVisible}
            />
          )}
        />
      </Tab.Navigator>
      <CreateCourt
        visible={createCourtVisible}
        setVisible={setCreateCourtVisible}
      />
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
