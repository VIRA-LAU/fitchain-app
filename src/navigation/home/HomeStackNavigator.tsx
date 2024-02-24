import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  GameDetails,
  InviteUsers,
  Profile,
  BranchDetails,
  RatePlayer,
  Notifications as NotificationsScreen,
  CreateGame,
  Games,
  StatisticsGames,
  StatisticsGameDetails,
  GameCreationType,
} from "screens";
import { BottomTabParamList } from "../tabScreenOptions";
import { Branch, Court, TimeSlot } from "src/types";
import { NavigatorScreenParams } from "@react-navigation/native";
import { CourtType, GameType } from "src/enum-types";
import { BottomTabNavigator } from "./BottomTabNavigator";

export type HomeStackParamList = {
  BottomBar: NavigatorScreenParams<BottomTabParamList>;
  CreateGame: {
    stage?: number;
    gameDetails?: GameCreationType;
  };
  CreateStatisticsGame: {
    data?: {
      stage?: number;
      gameType?: GameType;
      courtType?: CourtType;
      date?: string;
      selectedStartTime?: string;
      selectedDuration?: number;
      branchSearchText?: string;
      selectedBranch?: Branch;
      selectedCourt?: Court;
    };
    branchId?: number;
    courtTypes?: GameType[];
  };
  GameDetails: { id: number };
  StatisticsGameDetails: { id: number };
  InviteUsers: {
    gameId: number;
  };
  PlayerProfile: {
    playerId: number;
    firstName: string;
    lastName: string;
  };
  RatePlayer: {
    playerId: number;
    firstName: string;
    lastName: string;
    gameId: number;
    profilePhotoUrl?: string;
    coverPhotoUrl?: string;
  };
  Games: undefined;
  StatisticsGames: undefined;
  BranchDetails: {
    id: number;
    playScreenBookingDetails?: {
      date: string;
      nbOfPlayers: number;
      time?: TimeSlot;
      gameType: GameType;
    } | null;
  };
  Notifications: undefined;
};

export const HomeStackNavigator = () => {
  const Stack = createStackNavigator<HomeStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomBar" component={BottomTabNavigator} />
      <Stack.Screen name="Games" component={Games} />
      <Stack.Screen name="GameDetails" component={GameDetails} />
      <Stack.Screen name="BranchDetails" component={BranchDetails} />
      <Stack.Screen name="InviteUsers" component={InviteUsers} />
      <Stack.Screen name="RatePlayer" component={RatePlayer} />
      <Stack.Screen name="PlayerProfile" component={Profile} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="CreateGame" component={CreateGame} />
      <Stack.Screen name="StatisticsGames" component={StatisticsGames} />
      <Stack.Screen
        name="StatisticsGameDetails"
        component={StatisticsGameDetails}
      />
    </Stack.Navigator>
  );
};
