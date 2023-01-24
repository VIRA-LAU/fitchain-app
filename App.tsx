import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import AppRouter from "./src/AppRouter";

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      primary: "#f29c1f",
      secondary: "#3b3a42",
      background: "#2e2d36",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <AppRouter />
    </PaperProvider>
  );
}
