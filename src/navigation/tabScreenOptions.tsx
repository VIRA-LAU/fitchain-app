import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import { useTheme } from "react-native-paper";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";

export type BottomTabParamList = {
  Home: undefined;
  Games: undefined;
  Play: undefined;
  Venues: undefined;
  Profile: undefined;
};

export type VenueBottomTabParamList = {
  Home: undefined;
  Branch: undefined;
};

type Props = BottomTabScreenProps<BottomTabParamList & VenueBottomTabParamList>;

export const tabScreenOptions = ({
  route,
}: Props): BottomTabNavigationOptions => {
  const { colors } = useTheme();
  return {
    headerShown: false,
    tabBarIcon: ({ color }) => {
      if (route.name === "Home") {
        return <FeatherIcon name={"home"} size={20} color={color} />;
      } else if (route.name === "Games") {
        return <FeatherIcon name={"calendar"} size={20} color={color} />;
      } else if (route.name === "Venues") {
        return <IonIcon name={"location-outline"} size={20} color={color} />;
      } else if (route.name === "Profile" || route.name === "Branch") {
        return <MatComIcon name={"account-outline"} size={20} color={color} />;
      }
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: "white",
    tabBarStyle: {
      height: 80,
      borderColor: "white",
      position: "relative",
      backgroundColor: colors.secondary,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    tabBarItemStyle: { paddingBottom: 15 },
    tabBarActiveBackgroundColor: colors.secondary,
    tabBarInactiveBackgroundColor: colors.secondary,
  };
};
