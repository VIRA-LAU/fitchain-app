import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader, BranchLocation } from "src/components";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useBranchesQuery } from "src/api";
import { useContext } from "react";
import { UserContext } from "src/utils";
import { ScrollView } from "react-native-gesture-handler";

type Props = StackScreenProps<HomeStackParamList, "VenueBranches">;

export const VenueBranches = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { id } = route.params;
  const { userData } = useContext(UserContext);
  const { data: branches } = useBranchesQuery(userData!, id);

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
      <View style={styles.wrapperView}>
        <ScrollView style={styles.contentView}>
          {branches?.map((branch, index: number) => {
            const pricesArr = branch.courts.map(({ price }) => price);
            const prices =
              pricesArr.length === 1
                ? pricesArr[0].toString()
                : `${Math.min.apply(null, pricesArr)} - ${Math.max.apply(
                    null,
                    pricesArr
                  )}`;
            return (
              <BranchLocation
                key={index}
                type="branch"
                isPressable
                branch={{
                  location: branch.location,
                  courts: branch.courts
                    .map(({ courtType }) => courtType)
                    .join(", "),
                  prices,
                }}
              />
            );
          })}
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
