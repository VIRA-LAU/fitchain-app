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
import { useState } from "react";
import { en, registerTranslation } from "react-native-paper-dates";

registerTranslation("en", en);
function AppContent() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [branchData, setBranchData] = useState<BranchData | null>(null);

  const value = {
    userData,
    setUserData,
    branchData,
    setBranchData,
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
    <UserContext.Provider value={value}>
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
