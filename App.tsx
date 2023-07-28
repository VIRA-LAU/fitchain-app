import "react-native-gesture-handler";
import {
  configureFonts,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { Authenticator } from "navigation";
import { useFonts } from "expo-font/build/FontHooks";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContext, UserData, BranchData } from "src/utils";
import { useEffect, useState } from "react";
import { en, registerTranslation } from "react-native-paper-dates";
import client from "src/api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";
import * as Device from "expo-device";
import { useSignoutMutation } from "src/api";

registerTranslation("en", en);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      return;
    }
    await Notifications.getExpoPushTokenAsync();
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#f29c1f",
    });
  }
};

function AppContent() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [branchData, setBranchData] = useState<BranchData | null>(null);

  const { mutate: signout } = useSignoutMutation();

  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require("assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Medium": require("assets/fonts/Inter-Medium.ttf"),
  });

  const userContext = {
    userData,
    branchData,
    setUserData: (newUserData: UserData | null) => {
      if (newUserData)
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newUserData.token}`;
      else {
        client.defaults.headers.common["Authorization"] = null;
        AsyncStorage.clear();
        if (userData)
          signout({
            userId: userData.userId,
            isBranch: false,
          });
      }
      setUserData(newUserData);
    },
    setBranchData: (newBranchData: BranchData | null) => {
      if (newBranchData)
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newBranchData.token}`;
      else {
        client.defaults.headers.common["Authorization"] = null;
        AsyncStorage.clear();
        if (branchData)
          signout({
            userId: branchData.branchId,
            isBranch: false,
          });
      }
      setBranchData(newBranchData);
    },
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
    client.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          userContext.setUserData(null);
          userContext.setBranchData(null);
        } else throw err;
      }
    );
  }, []);

  const fontConfig = {
    headlineSmall: {
      fontFamily: "Inter-SemiBold",
    },
    titleLarge: {
      fontFamily: "Inter-SemiBold",
    },
    titleSmall: {
      fontFamily: "Inter-SemiBold",
    },
    labelLarge: {
      fontFamily: "Inter-SemiBold",
    },
    headlineLarge: {
      fontFamily: "Inter-SemiBold",
    },
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      primary: "#f29c1f",
      secondary: "#3b3a42",
      tertiary: "#9e9e9e",
      background: "#2e2d36",
      elevation: {
        level3: "#3b3a42",
      },
    },
    fonts: configureFonts({ config: fontConfig }),
  };

  if (!fontsLoaded) return null;
  return (
    <UserContext.Provider value={userContext}>
      <NavigationContainer theme={DarkTheme}>
        <PaperProvider theme={theme}>
          <StatusBar
            barStyle={"light-content"}
            backgroundColor={"transparent"}
            translucent
          />
          <Authenticator />
        </PaperProvider>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
