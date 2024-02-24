import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  BranchHome,
  BranchManagement,
  CreateCourt,
  courtToEdit,
} from "screens";
import {
  BranchBottomTabParamList,
  tabScreenOptions,
} from "../tabScreenOptions";
import * as Location from "expo-location";

const Tab = createBottomTabNavigator<BranchBottomTabParamList>();

export const BranchBottomTabNavigator = () => {
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
