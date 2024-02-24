import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ScrollView, StyleSheet } from "react-native";
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
        <CommunityPost
          profileImage={require("assets/images/home/profile1.jpg")}
        />
        <CommunityPost
          image
          profileImage={require("assets/images/home/profile2.jpg")}
        />
        <CommunityPost
          profileImage={require("assets/images/home/profile3.jpg")}
        />
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
