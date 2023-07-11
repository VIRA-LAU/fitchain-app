import "react-native-gesture-handler";
import {
  configureFonts,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { AppNavigator } from "navigation";
import { useFonts } from "expo-font/build/FontHooks";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContext, UserData, BranchData } from "src/utils";
import { useEffect, useState } from "react";
import { en, registerTranslation } from "react-native-paper-dates";
import client from "src/api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

registerTranslation("en", en);
function AppContent() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [branchData, setBranchData] = useState<BranchData | null>(null);

  useEffect(() => {
    client.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          AsyncStorage.clear();
          client.defaults.headers.common["Authorization"] = null;
          setUserData(null);
          setBranchData(null);
        } else throw err;
      }
    );
  });

  const userContext = {
    userData,
    branchData,
    setUserData: (userData: UserData) => {
      if (userData !== null)
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userData.token}`;
      setUserData(userData);
    },
    setBranchData: (branchData: BranchData) => {
      if (branchData !== null)
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${branchData.token}`;
      setBranchData(branchData);
    },
  };

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
    },
    fonts: configureFonts({ config: fontConfig }),
  };
  return (
    <UserContext.Provider value={userContext}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={DarkTheme}>
          <StatusBar
            barStyle={"light-content"}
            backgroundColor={"transparent"}
            translucent
          />
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </UserContext.Provider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require("assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Medium": require("assets/fonts/Inter-Medium.ttf"),
  });
  const queryClient = new QueryClient();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
