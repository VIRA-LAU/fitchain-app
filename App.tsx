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
import { en, registerTranslation } from "react-native-paper-dates";

registerTranslation("en", en);
// Define a separate component for the App content
function AppContent() {
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
