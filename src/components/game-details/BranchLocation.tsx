import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, StyleSheet, View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import OctIcon from "react-native-vector-icons/Octicons";
import { BottomTabParamList, HomeStackParamList } from "navigation";
import { Court, Game, VenueBranch } from "src/types";
import FeatherIcon from "react-native-vector-icons/Feather";

export const BranchLocation = ({
  type,
  court,
  branch,
  team,
  isPressable = false,
}: {
  type: "branch" | "court";
  court?: Game["court"];
  branch?: {
    venueName: string;
    location: string;
    courts: Court[];
    rating: number;
  };
  team?: "Home" | "Away";
  isPressable?: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();
  let courtsStr = "";
  let prices = "";
  if (branch) {
    const pricesArr = branch?.courts.map(({ price }) => price);
    prices =
      pricesArr?.length === 1
        ? pricesArr[0].toString()
        : `${Math.min.apply(null, pricesArr!)} - ${Math.max.apply(
            null,
            pricesArr!
          )}`;

    courtsStr = branch.courts.map(({ courtType }) => courtType).join(", ");
  }
  return (
    <Pressable
      style={styles.wrapperView}
      onPress={() => {
        if (isPressable && branch)
          navigation.push("BranchCourts", {
            courts: branch.courts,
            venueName: branch.venueName,
            branchLocation: branch.location,
          });
      }}
    >
      <Image
        style={styles.background}
        source={require("assets/images/home/hoops-location.png")}
      />
      <View style={styles.dataView}>
        <View style={styles.headerView}>
          <Image
            source={require("assets/images/home/basketball-hub-icon.png")}
            style={{ width: 35, aspectRatio: 1 }}
          />
          <View style={styles.titleView}>
            <Text style={styles.title}>
              {type === "court" ? court?.branch.venue.name : branch?.location}
            </Text>
            {type === "court" && (
              <Text style={styles.subtitle}>
                {type === "court" && court?.branch.location}
              </Text>
            )}
          </View>
          {type === "branch" && (
            <FeatherIcon
              name={"star"}
              color={"white"}
              size={14}
              style={{ marginLeft: "auto", marginRight: 5 }}
            />
          )}
          {type === "branch" && (
            <View>
              <Text style={styles.title}>{branch?.rating}</Text>
            </View>
          )}
        </View>
        {type === "court" && (
          <View style={styles.rowView}>
            <Text style={styles.rowKey}>COURT</Text>
            <Text style={styles.rowValue}>A003</Text>
          </View>
        )}
        {type === "court" && (
          <View style={styles.rowView}>
            <Text style={styles.rowKey}>SIDE</Text>
            <Text style={styles.rowValue}>{team}</Text>
          </View>
        )}
        {type === "court" && (
          <View style={styles.rowView}>
            <Text style={styles.rowKey}>PRICE</Text>
            <Text style={styles.rowValue}>USD 12/hr</Text>
          </View>
        )}
        {type === "branch" && (
          <View style={styles.rowView}>
            <Text style={styles.rowKey}>COURTS</Text>
            <Text style={styles.rowValue}>{courtsStr}</Text>
          </View>
        )}
        {type === "branch" && (
          <View style={styles.rowView}>
            <Text style={styles.rowKey}>PRICE</Text>
            <Text style={styles.rowValue}>USD {prices}/hr</Text>
          </View>
        )}
      </View>
      <View style={styles.icon}>
        <OctIcon name="location" color="white" size={24} />
      </View>
    </Pressable>
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
      width: "60%",
      margin: 10,
      backgroundColor: colors.secondary,
      borderRadius: 10,
      padding: 10,
    },
    headerView: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 5,
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
