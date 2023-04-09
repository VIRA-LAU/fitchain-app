import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader, BranchLocation } from "src/components";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useBranchesQuery } from "src/api";
import { ScrollView } from "react-native-gesture-handler";

type Props = StackScreenProps<HomeStackParamList, "VenueBranches">;

export const VenueBranches = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { id, venueName } = route.params;
  const { data: branches } = useBranchesQuery(id);

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      right={<IonIcon name="ellipsis-horizontal" color="white" size={24} />}
      title={"Branches"}
      searchBar
      backEnabled
    >
      <ScrollView contentContainerStyle={styles.wrapperView}>
        {branches?.map((branch, index: number) => {
          return (
            <BranchLocation
              key={index}
              type="branch"
              isPressable
              branch={{
                venueName,
                location: branch.location,
                courts: branch.courts,
                rating: 0,
                latitude: branch.latitude,
                longitude: branch.longitude,
              }}
            />
          );
        })}
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      marginHorizontal: "3%",
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
  });
