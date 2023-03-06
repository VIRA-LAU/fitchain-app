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

type Props = StackScreenProps<HomeStackParamList, "venueBranches">;

export const VenueBranches = ({ navigation, route }: Props) => {
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
      right={<IonIcon name="ellipsis-horizontal" color="white" size={24} />}
      title={"Branches"}
      left={
        <SportTypeDropdown
          selectedSports={selectedSports}
          setSelectedSports={setSelectedSports}
        />
      }
      searchBar
    >
      <View style={styles.wrapperView}>
        <ScrollView style={styles.contentView}>
          <VenueLocation branch />
          <VenueLocation branch />
          <VenueLocation branch />
        </ScrollView>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    background: {
      position: "absolute",
      height: "100%",
      width: "100%",
      borderRadius: 10,
    },
    dataView: {
      width: "50%",
      margin: 10,
      backgroundColor: colors.secondary,
      borderRadius: 10,
      padding: 10,
    },
    headerView: {
      flexDirection: "row",
      alignItems: "center",
      padding: 5,
    },
    titleView: { marginLeft: 10 },
    icon: {
      flex: 1,
      alignItems: "center",
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 2,
    },
    title: {
      color: "white",
      fontFamily: "Inter-Medium",
    },
    subtitle: {
      color: colors.tertiary,
      fontFamily: "Inter-Medium",
      fontSize: 12,
    },
    rowKey: {
      color: colors.tertiary,
      fontFamily: "Inter-Medium",
      fontSize: 10,
    },
    rowValue: {
      color: "white",
      fontFamily: "Inter-Medium",
      fontSize: 10,
    },
    contentView: {
      marginVertical: 10,
      marginHorizontal: "3%",
    },
  });
