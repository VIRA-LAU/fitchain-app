import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  BranchHome,
  BranchManagement,
  CreateCourt,
  courtToEdit,
} from "screens";
import { BranchBottomTabParamList, tabScreenOptions } from "./tabScreenOptions";
import * as Location from "expo-location";
import { NavigatorScreenParams } from "@react-navigation/native";

const Tab = createBottomTabNavigator<BranchBottomTabParamList>();

const BottomTabNavigator = () => {
  const [createCourtVisible, setCreateCourtVisible] = useState<
    "create" | "edit" | false
  >(false);

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
              setCreateCourtVisible={setCreateCourtVisible}
            />
          )}
        />
      </Tab.Navigator>
      <CreateCourt
        visible={createCourtVisible}
        setVisible={setCreateCourtVisible}
        existingInfo={courtToEdit?.current}
      />
    </View>
  );
};

export type BranchStackParamList = {
  BottomBar: NavigatorScreenParams<BranchBottomTabParamList>;
};

export const BranchHomeNavigator = () => {
  const Stack = createStackNavigator<BranchStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomBar" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};
