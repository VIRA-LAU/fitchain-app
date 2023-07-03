import React, { useContext, useEffect, useState } from "react";
import { NavigatorScreenParams } from "@react-navigation/native";
import { SignUpNavigator } from "./SignUpNavigator";
import { BottomTabParamList } from "./tabScreenOptions";
import { GameType, Branch, TimeSlot } from "src/types";
import { getData } from "src/utils/AsyncStorage";
import { UserContext } from "src/utils";
import { useUserDetailsQuery, useBranchByIdQuery } from "src/api";
import { HomeNavigator } from "./HomeNavigator";
import { VenueHomeNavigator } from "./BranchHomeNavigator";
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
  const { userData, venueData, setUserData, setVenueData } =
    useContext(UserContext);

  const [signedIn, setSignedIn] = useState<"player" | "venue" | null>(null);
  const [tokenFoundOnOpen, setTokenFoundOnOpen] = useState<boolean>(false);
  const { refetch: verifyUserToken, isLoading: verifyUserLoading } =
    useUserDetailsQuery(
      userData?.userId,
      false,
      setSignedIn,
      setTokenFoundOnOpen
    );
  const { refetch: verifyVenueToken, isLoading: verifyVenueLoading } =
    useBranchByIdQuery(
      venueData?.branchId,
      false,
      setSignedIn,
      setTokenFoundOnOpen
    );

  const getToken = async () => {
    const isVenue: boolean = await getData("isVenue");
    if (typeof isVenue !== "undefined") {
      if (isVenue) {
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
          setVenueData({
            branchId,
            venueId,
            venueName,
            branchLocation,
            managerFirstName,
            managerLastName,
            email,
            token,
          });
          setTokenFoundOnOpen(true);
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
          setTokenFoundOnOpen(true);
        }
      }
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (userData && tokenFoundOnOpen) verifyUserToken();
  }, [JSON.stringify(userData), tokenFoundOnOpen]);

  useEffect(() => {
    if (venueData && tokenFoundOnOpen) verifyVenueToken();
  }, [JSON.stringify(venueData), tokenFoundOnOpen]);

  if (signedIn === "player") return <HomeNavigator setSignedIn={setSignedIn} />;
  else if (signedIn === "venue")
    return <VenueHomeNavigator setSignedIn={setSignedIn} />;
  else
    return (
      <SignUpNavigator
        setSignedIn={setSignedIn}
        storedEmail={userData?.email || venueData?.email}
        verifyLoading={verifyUserLoading || verifyVenueLoading}
      />
    );
};
