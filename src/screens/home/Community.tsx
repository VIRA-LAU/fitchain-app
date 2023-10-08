import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { AppHeader, CommunityPost } from "src/components";
import { BottomTabParamList } from "src/navigation";

type Props = BottomTabScreenProps<BottomTabParamList>;

export const Community = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <AppHeader absolutePosition={false} title={"Community"}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <CommunityPost />
        <CommunityPost image />
        <CommunityPost />
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexGrow: 1,
      paddingBottom: 60,
    },
  });
