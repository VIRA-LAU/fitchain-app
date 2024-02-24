import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BranchBottomTabParamList } from "../tabScreenOptions";
import { NavigatorScreenParams } from "@react-navigation/native";
import { BranchBottomTabNavigator } from "./BranchBottomTabNavigator";

export type BranchStackParamList = {
  BottomBar: NavigatorScreenParams<BranchBottomTabParamList>;
};

export const BranchHomeNavigator = () => {
  const Stack = createStackNavigator<BranchStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomBar" component={BranchBottomTabNavigator} />
    </Stack.Navigator>
  );
};
