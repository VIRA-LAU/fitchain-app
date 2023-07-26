import React, { useContext, useEffect } from "react";
import { NavigatorScreenParams } from "@react-navigation/native";
import { SignUpNavigator } from "./SignUpNavigator";
import { BottomTabParamList } from "./tabScreenOptions";
import { GameType, TimeSlot } from "src/types";
import { UserContext, getData } from "src/utils";
import { HomeNavigator } from "./HomeNavigator";
import { BranchHomeNavigator } from "./BranchHomeNavigator";
import { LatLng } from "react-native-maps";
import { NotificationService } from "src/utils/NotificationService";

export type StackParamList = {
  BottomBar: NavigatorScreenParams<BottomTabParamList>;
  GameDetails: { id: number; isPrevious: boolean };
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
  BranchDetails: {
    id: number;
    playScreenBookingDetails?: {
      date: string;
      nbOfPlayers: number;
      startTime?: string;
      endTime?: string;
      gameType: GameType;
    } | null;
  };
  ChooseBranch: {
    gameType: GameType;
    nbOfPlayers: number;
    date: string;
    location: LatLng;
    locationName: string;
    startTime?: string;
    endTime?: string;
  };
  ChooseCourt: {
    venueName?: string;
    branchId: number;
    branchLocation?: string;
    bookingDetails?: {
      date: string;
      nbOfPlayers: number;
      startTime?: string;
      endTime?: string;
      gameType: GameType;
    };
    profilePhotoUrl?: string;
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
  BookingPayment: {
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
    profilePhotoUrl?: string;
  };
};

export const Authenticator = () => {
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

  if (userData)
    return (
      <NotificationService>
        <HomeNavigator />
      </NotificationService>
    );
  else if (branchData)
    <NotificationService>
      <BranchHomeNavigator />
    </NotificationService>;
  else return <SignUpNavigator />;
};