import "react-native-gesture-handler";
import {
  configureFonts,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
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
      lightColor: "#F77E05",
    });
  }
};

function AppContent() {
  const [userData, setUserData] = useState<UserData | null | undefined>(
    undefined
  );
  const [branchData, setBranchData] = useState<BranchData | null | undefined>(
    undefined
  );

  const { mutate: signout } = useSignoutMutation();

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("assets/fonts/Poppins-Regular.ttf"), // 400
    "Poppins-Medium": require("assets/fonts/Poppins-Medium.ttf"), // 500
    "Poppins-Bold": require("assets/fonts/Poppins-Bold.ttf"), // 700
  });

  const userContext = {
    userData,
    branchData,
    setUserData: (newUserData: UserData | null | undefined) => {
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
    setBranchData: (newBranchData: BranchData | null | undefined) => {
      if (newBranchData)
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newBranchData.token}`;
      else {
        client.defaults.headers.common["Authorization"] = null;
        AsyncStorage.clear();
        // if (branchData)
        //   signout({
        //     userId: branchData.branchId,
        //     isBranch: false,
        //   });
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
      fontFamily: "Poppins-Bold",
    },
    headlineMedium: {
      fontFamily: "Poppins-Bold",
    },
    headlineLarge: {
      fontFamily: "Poppins-Bold",
    },
    titleSmall: {
      fontFamily: "Poppins-Bold",
    },
    titleLarge: {
      fontFamily: "Poppins-Bold",
    },
    labelLarge: {
      fontFamily: "Poppins-Medium",
    },
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      primary: "#F77E05",
      background: "#fff",
      onPrimary: "#FFF",
      secondary: "#F2F4F7",
      tertiary: "#2B2B2B",
      elevation: {
        level3: "#F2F4F7",
      },
    },
    roundness: 1.5,
    fonts: configureFonts({ config: fontConfig }),
  };

  if (!fontsLoaded) return null;
  return (
    <UserContext.Provider value={userContext}>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <StatusBar
            barStyle={"dark-content"}
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
