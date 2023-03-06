import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { Image, StyleSheet, View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import OctIcon from "react-native-vector-icons/Octicons";
import { BottomTabParamList, HomeStackParamList } from "navigation";
import {
  AppHeader,
  SportTypeDropdown,
  VenueCard,
  VenueLocation,
} from "src/components";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useBranchesQuery } from "src/api";
import { useContext, useState } from "react";
import { UserContext } from "src/utils";
import { VenueBranch } from "src/types";
import { ScrollView } from "react-native-gesture-handler";
import { VenueBranchCard } from "src/components/game-details/VenueBranchCard";
import { CourtCard } from "src/components/game-details/CourtCard";

type Props = StackScreenProps<HomeStackParamList, "branchCourts">;

export const branchCourts = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { userData } = useContext(UserContext);
  const { data: branchesVenues } = useBranchesQuery(userData!);

  const [selectedSports, setSelectedSports] = useState({
    basketball: true,
    football: true,
    tennis: true,
  });

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Select Court"}
      backEnabled
    >
      <View style={styles.wrapperView}>
        <ScrollView style={styles.contentView}>
          <Text
            variant="labelLarge"
            style={[{ color: colors.tertiary }, styles.locationComponent]}
          >
            Hoops Club, Hazmieh
          </Text>
          <CourtCard />
          <CourtCard />
          <CourtCard />
          <CourtCard />
          <CourtCard />
        </ScrollView>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    locationComponent: {
      margin: 20,
    },
    wrapperView: {
      flexDirection: "row",
      alignItems: "center",
    },

    contentView: {},
  });
