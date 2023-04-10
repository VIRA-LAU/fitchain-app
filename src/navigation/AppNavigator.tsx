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
    date: string;
    location: LatLng;
    locationName: string;
    startTime?: string;
    endTime?: string;
  };
  BranchCourts: {
    venueName: string;
    courts: VenueBranch["courts"];
    branchLocation: string;
    bookingDetails?: {
      date: string;
      startTime?: string;
      endTime?: string;
      gameType: GameType;
    };
  };
  ChooseVenue: {
    gameType: GameType;
    date: string;
    location: LatLng;
    locationName: string;
    venueId?: number;
    startTime?: string;
    endTime?: string;
  };
  ChooseGame: {
    gameType: GameType;
    location: LatLng;
    locationName: string;
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
};

export const AppNavigator = () => {
  const { userData, setUserData } = useContext(UserContext) as any;

  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [tokenFoundOnOpen, setTokenFoundOnOpen] = useState<boolean>(false);
  const { refetch: verifyToken } = useUserDetailsQuery(
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
      let fetchedData = {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        token: token,
      };
      setUserData(fetchedData);
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
