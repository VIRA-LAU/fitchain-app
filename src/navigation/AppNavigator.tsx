import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import { useTheme } from "react-native-paper";
import { GameDetails, Games, Home, Profile, Venues } from "screens";
import { SignUpNavigator } from "./SignUpNavigator";
import { BottomTabParamList, tabScreenOptions } from "./tabScreenOptions";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Games" component={Games} />
      <Tab.Screen
        name="Play"
        component={Home}
        options={{
          tabBarIconStyle: {
            top: -20,
            backgroundColor: colors.primary,
            aspectRatio: 1,
            borderRadius: 40,
            margin: -10,
          },
        }}
      />
      <Tab.Screen name="Venues" component={Venues} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export type HomeStackParamList = {
  BottomBar: NavigatorScreenParams<BottomTabParamList>;
  GameDetails: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

export const AppNavigator = () => {
  const [signedIn, setSignedIn] = useState<boolean>(false);

  if (signedIn)
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BottomBar" component={BottomTabNavigator} />
          <Stack.Screen name="GameDetails" component={GameDetails} />
        </Stack.Navigator>
    );
  else return <SignUpNavigator setSignedIn={setSignedIn} />;
};
