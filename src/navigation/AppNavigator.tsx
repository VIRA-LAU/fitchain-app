import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  useWindowDimensions,
  View,
  Pressable,
  StyleSheet,
  BackHandler,
} from "react-native";
import { NavigatorScreenParams } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, useTheme } from "react-native-paper";
import {
  GameDetails,
  Games,
  Home,
  InviteUsers,
  Play,
  Profile,
  VenueBookingDetails,
  VenueBranches,
  VenueDetails,
  Venues,
  BranchCourts,
  ChooseVenue,
  ChooseGame,
} from "screens";
import { SignUpNavigator } from "./SignUpNavigator";
import { BottomTabParamList, tabScreenOptions } from "./tabScreenOptions";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { GameType, VenueBranch } from "src/types";
import { getData } from "src/utils/AsyncStorage";
import { UserContext } from "src/utils";
import { useUserDetailsQuery } from "src/api";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = ({
  setSignedIn,
}: {
  setSignedIn: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors, useWindowDimensions().width);
  const [playScreenVisible, setPlayScreenVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleBack = () => {
      if (playScreenVisible) {
        setPlayScreenVisible(false);
        return true;
      } else return false;
    };
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, [playScreenVisible]);

  return (
    <View style={{ height: "100%", position: "relative" }}>
      <Tab.Navigator screenOptions={tabScreenOptions}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Games" component={Games} />
        <Tab.Screen
          name="Play"
          component={View}
          options={{
            tabBarLabelStyle: {
              color: "transparent",
            },
            tabBarItemStyle: {
              width: 0,
            },
          }}
        />
        <Tab.Screen name="Venues" component={Venues} />
        <Tab.Screen
          name="Profile"
          children={(props) => (
            <Profile
              isUserProfile={true}
              setSignedIn={setSignedIn}
              {...props}
            />
          )}
        />
      </Tab.Navigator>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Pressable
          style={styles.playIconView}
          onPress={() => {
            setPlayScreenVisible(true);
          }}
        >
          <View style={styles.playIcon}>
            <IonIcon name={"basketball-outline"} size={35} color={"white"} />
          </View>
          <Text style={styles.playText}>Play</Text>
        </Pressable>
      </View>
      <Play visible={playScreenVisible} setVisible={setPlayScreenVisible} />
    </View>
  );
};

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
      timeSlotId: number;
      startTime?: string;
      endTime?: string;
      gameType: GameType;
    };
  };
  VenueBranches: { id: number; venueName: string };
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
    location?: string;
    venueId?: number;
    startTime?: string;
    endTime?: string;
  };
  ChooseGame: {
    gameType: GameType;
    date?: string;
    location?: string;
    startTime?: string;
    endTime?: string;
  };
  InviteUsers: {
    gameId: number;
  };
};

const Stack = createStackNavigator<HomeStackParamList>();

export const AppNavigator = () => {
  const { userData, setUserData } = useContext(UserContext) as any;

  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [tokenFoundOnOpen, setTokenFoundOnFound] = useState<boolean>(false);
  const { refetch: verifyToken } = useUserDetailsQuery(false, setSignedIn);

  const getToken = async () => {
    const firstName = await getData("firstName");
    const lastName = await getData("lastName");
    const email = await getData("email");
    const userId = await getData("userId");
    const token = await getData("token");
    if (firstName && lastName && email && userId && token) {
      let fetchedData = {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        token: token,
      };
      setUserData(fetchedData);
      setTokenFoundOnFound(true);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (userData && tokenFoundOnOpen) verifyToken();
  }, [JSON.stringify(userData), tokenFoundOnOpen]);

  if (signedIn)
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomBar">
          {(props) => (
            <BottomTabNavigator {...props} setSignedIn={setSignedIn} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="VenueBookingDetails"
          component={VenueBookingDetails}
        />
        <Stack.Screen name="GameDetails" component={GameDetails} />
        <Stack.Screen name="VenueDetails" component={VenueDetails} />
        <Stack.Screen name="VenueBranches" component={VenueBranches} />
        <Stack.Screen name="BranchCourts" component={BranchCourts} />
        <Stack.Screen name="ChooseVenue" component={ChooseVenue} />
        <Stack.Screen name="ChooseGame" component={ChooseGame} />
        <Stack.Screen name="InviteUsers" component={InviteUsers} />
      </Stack.Navigator>
    );
  else return <SignUpNavigator setSignedIn={setSignedIn} />;
};

const makeStyles = (colors: MD3Colors, windowWidth: number) =>
  StyleSheet.create({
    playIconView: {
      width: windowWidth / 5,
      justifyContent: "center",
      alignItems: "center",
    },
    playIcon: {
      width: windowWidth / 5.5,
      aspectRatio: 1,
      backgroundColor: colors.primary,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    playText: { height: 40, fontSize: 10, color: "white", paddingTop: 12 },
  });
