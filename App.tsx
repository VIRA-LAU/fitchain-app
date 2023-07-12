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

export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [branchData, setBranchData] = useState<BranchData | null>(null);

  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require("assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Medium": require("assets/fonts/Inter-Medium.ttf"),
  });

  const queryClient = new QueryClient();

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
  }, []);

  const userContext = {
    userData,
    branchData,
    setUserData: (userData: UserData | null) => {
      if (userData)
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userData.token}`;
      else AsyncStorage.clear();
      setUserData(userData);
    },
    setBranchData: (branchData: BranchData | null) => {
      if (branchData)
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${branchData.token}`;
      else AsyncStorage.clear();
      setBranchData(branchData);
    },
  };

  if (!fontsLoaded) {
    return null;
  }

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
  return (
    <UserContext.Provider value={userContext}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </UserContext.Provider>
  );
}
