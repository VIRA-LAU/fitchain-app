import React, { useContext, useEffect } from "react";
import { NavigatorScreenParams } from "@react-navigation/native";
import { SignUpNavigator } from "./SignUpNavigator";
import { BottomTabParamList } from "./tabScreenOptions";
import { GameType, Branch, TimeSlot } from "src/types";
import { UserContext, getData } from "src/utils";
import { HomeNavigator } from "./HomeNavigator";
import { BranchHomeNavigator } from "./BranchHomeNavigator";
import { LatLng } from "react-native-maps";

export type HomeStackParamList = {
  BottomBar: NavigatorScreenParams<BottomTabParamList>;
  GameDetails: { id: number; isPrevious: boolean };
  VenueDetails: {
    id: number;
    isPlayScreen: boolean;
    playScreenBranch: Branch | null;
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
    courtName: string;
    courtType: string;
    courtRating: number;
    courtMaxPlayers: number;
    selectedTimeSlots: TimeSlot[];
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
    courts: Branch["courts"];
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
    profilePhotoUrl?: string;
    coverPhotoUrl?: string;
  };
  PlayerProfile: {
    playerId: number;
    firstName: string;
    lastName: string;
  };
};

export const AppNavigator = () => {
  const { userData, branchData, setUserData, setBranchData } =
    useContext(UserContext);

  const getLocalData = async () => {
    const isBranch: boolean = await getData("isBranch");
    if (typeof isBranch !== "undefined") {
      if (isBranch) {
        const branchId: number = await getData("branchId");
        const venueId: number = await getData("venueId");
        const venueName: string = await getData("venueName");
        const branchLocation: string = await getData("branchLocation");
        const managerFirstName: string = await getData("managerFirstName");
        const managerLastName: string = await getData("managerLastName");
        const email: string = await getData("email");
        const token: string = await getData("token");
        if (
          branchId &&
          venueId &&
          venueName &&
          branchLocation &&
          managerFirstName &&
          managerLastName &&
          email &&
          token
        ) {
          setBranchData({
            branchId,
            venueId,
            venueName,
            branchLocation,
            managerFirstName,
            managerLastName,
            email,
            token,
          });
        }
      } else {
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
        }
      }
    }
  };

  useEffect(() => {
    getLocalData();
  }, []);

  if (userData) return <HomeNavigator />;
  else if (branchData) return <BranchHomeNavigator />;
  else return <SignUpNavigator />;
};
