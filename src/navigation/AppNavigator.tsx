import React, { useContext, useEffect, useState } from "react";
import { NavigatorScreenParams } from "@react-navigation/native";
import { SignUpNavigator } from "./SignUpNavigator";
import { BottomTabParamList } from "./tabScreenOptions";
import { GameType, VenueBranch } from "src/types";
import { getData } from "src/utils/AsyncStorage";
import { UserContext } from "src/utils";
import { useUserDetailsQuery } from "src/api";
import { HomeNavigator } from "./HomeNavigator";
import { LatLng } from "react-native-maps";

export type HomeStackParamList = {
  BottomBar: NavigatorScreenParams<BottomTabParamList>;
  GameDetails: { id: number };
  VenueDetails: {
    id: number;
    isPlayScreen: boolean;
    playScreenBranch: VenueBranch | null;
    playScreenBookingDetails?: {
      date: string;
      nbOfPlayers: number;
      startTime?: string;
      endTime?: string;
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
      nbOfPlayers: number;
      timeSlotIds: number[];
      startTime?: string;
      endTime?: string;
      gameType: GameType;
    };
  };
  VenueBranches: {
    id: number;
    venueName: string;
    gameType: GameType;
    nbOfPlayers: number;
    date: string;
    location: LatLng;
    startTime?: string;
    endTime?: string;
  };
  BranchCourts: {
    venueName: string;
    courts: VenueBranch["courts"];
    branchLocation: string;
    bookingDetails?: {
      date: string;
      nbOfPlayers: number;
      startTime?: string;
      endTime?: string;
      gameType: GameType;
    };
  };
  ChooseVenue: {
    gameType: GameType;
    nbOfPlayers: number;
    date: string;
    location: LatLng;
    locationName: string;
    startTime?: string;
    endTime?: string;
  };
  ChooseGame: {
    gameType: GameType;
    location: LatLng;
    locationName: string;
    nbOfPlayers: number;
    date?: string;
    startTime?: string;
    endTime?: string;
  };
  InviteUsers: {
    gameId: number;
  };
  RatePlayer: {
    playerId: number;
    firstName: string;
    lastName: string;
    gameId: number;
  };
  PlayerProfile: {
    playerId: number;
    firstName: string;
    lastName: string;
  };
};

export const AppNavigator = () => {
  const { userData, setUserData } = useContext(UserContext);

  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [tokenFoundOnOpen, setTokenFoundOnOpen] = useState<boolean>(false);
  const { refetch: verifyToken } = useUserDetailsQuery(
    userData?.userId,
    false,
    setSignedIn,
    setTokenFoundOnOpen
  );

  const getToken = async () => {
    const firstName: string = await getData("firstName");
    const lastName: string = await getData("lastName");
    const email: string = await getData("email");
    const userId: number = await getData("userId");
    const token: string = await getData("token");
    if (firstName && lastName && email && userId && token) {
      setUserData({
        userId,
        firstName,
        lastName,
        email,
        token,
      });
      setTokenFoundOnOpen(true);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (userData && tokenFoundOnOpen) verifyToken();
  }, [JSON.stringify(userData), tokenFoundOnOpen]);

  if (signedIn) return <HomeNavigator setSignedIn={setSignedIn} />;
  else return <SignUpNavigator setSignedIn={setSignedIn} />;
};
