import "react-native-gesture-handler";
import {
  configureFonts,
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import AppRouter from "src/AppNavigator";
import { useFonts } from "expo-font/build/FontHooks";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Inter-SemiBold": require("./src/assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Medium": require("./src/assets/fonts/Inter-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const fontConfig = {
    titleLarge: {
      fontFamily: "Inter-SemiBold",
    },
    titleSmall: {
      fontFamily: "Inter-SemiBold",
    },
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      primary: "#f29c1f",
      secondary: "#3b3a42",
      background: "#2e2d36",
    },
    fonts: configureFonts({ config: fontConfig }),
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={theme.colors.background}
        />
        <AppRouter />
      </NavigationContainer>
    </PaperProvider>
  );
}
