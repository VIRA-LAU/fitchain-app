import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { NavigationHeader } from "components";
import { BottomTabParamList } from "src/navigation/tabScreenOptions";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

type Props = BottomTabScreenProps<BottomTabParamList>;

export const Home = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      logo
    >
      <View style={styles.wrapperView}>
        <Text style={{ color: colors.primary }}>Welcome to Fitchain!</Text>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
