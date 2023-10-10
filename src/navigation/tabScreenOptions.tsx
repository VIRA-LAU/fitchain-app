import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import { useTheme } from "react-native-paper";
import { Image, StyleSheet } from "react-native";

export type BottomTabParamList = {
  Home: undefined;
  Challenges: undefined;
  Play: undefined;
  Community: undefined;
  Profile: undefined;
};

export type BranchBottomTabParamList = {
  Home: undefined;
  Branch: undefined;
};

type Props = BottomTabScreenProps<
  BottomTabParamList & BranchBottomTabParamList
>;

export const tabScreenOptions = ({
  route,
}: Props): BottomTabNavigationOptions => {
  const { colors } = useTheme();
  return {
    headerShown: false,
    tabBarIcon: ({ color }) => {
      if (route.name === "Home") {
        if (color === colors.primary)
          return (
            <Image
              source={require("assets/icons/home-primary.png")}
              style={styles.icon}
            />
          );
        else
          return (
            <Image
              source={require("assets/icons/home-dark.png")}
              style={styles.icon}
            />
          );
      } else if (route.name === "Challenges") {
        if (color === colors.primary)
          return (
            <Image
              source={require("assets/icons/challenges-primary.png")}
              style={styles.icon}
            />
          );
        else
          return (
            <Image
              source={require("assets/icons/challenges-dark.png")}
              style={styles.icon}
            />
          );
      } else if (route.name === "Community") {
        if (color === colors.primary)
          return (
            <Image
              source={require("assets/icons/community-primary.png")}
              style={[styles.icon, { width: "35%" }]}
            />
          );
        else
          return (
            <Image
              source={require("assets/icons/community-dark.png")}
              style={[styles.icon, { width: "35%" }]}
            />
          );
      } else if (route.name === "Profile" || route.name === "Branch") {
        if (color === colors.primary)
          return (
            <Image
              source={require("assets/icons/profile-primary.png")}
              style={styles.icon}
            />
          );
        else
          return (
            <Image
              source={require("assets/icons/profile-dark.png")}
              style={styles.icon}
            />
          );
      }
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.tertiary,
    tabBarStyle: {
      height: 80,
      borderColor: colors.tertiary,
      position: "relative",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    tabBarLabelStyle: {
      fontFamily: "Poppins-Medium",
      marginBottom: 10,
    },
    tabBarActiveBackgroundColor: colors.background,
    tabBarInactiveBackgroundColor: colors.background,
  };
};

const styles = StyleSheet.create({
  icon: { width: "25%", resizeMode: "contain" },
});
