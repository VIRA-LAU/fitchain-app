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
import FeatherIcon from "react-native-vector-icons/Feather";

export const CourtCard = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();
  return (
    <Pressable
      style={styles.wrapperView}
      onPress={() => {
        navigation.push("VenueBookingDetails");
      }}
    >
      <View style={styles.dataView}>
        <View style={styles.headerView}>
          <View style={styles.titleView}>
            <Image
              style={styles.background}
              source={require("assets/images/home/basketball-court-icon.png")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.rowView}>
              <Text variant="labelLarge" style={styles.courtType}>
                Basketball
              </Text>
              <View style={styles.rating}>
                <FeatherIcon name={`star`} color={"white"} size={14} />
                <Text style={styles.title}>3.6</Text>
              </View>
            </View>

            <View style={[styles.rowView, { marginVertical: -10 }]}>
              <Text style={styles.subtitle}>TYPE</Text>
              <Text style={styles.rowValue}>Full-Court</Text>
            </View>
            <View style={styles.rowView}>
              <Text style={styles.subtitle}>PRICE</Text>
              <Text style={styles.rowValue}>USD 12-23/hr</Text>
            </View>
          </View>
        </View>
        <View style={styles.lineStyle} />
      </View>
    </Pressable>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    rating: {
      flexDirection: "row",
    },
    lineStyle: {
      marginTop: 10,
      borderWidth: 0.3,
      borderColor: colors.tertiary,
    },
    courtType: {
      color: "white",
    },
    wrapperView: {
      flexDirection: "row",
      alignItems: "center",
    },
    background: {
      height: 75,
      width: 75,
      borderRadius: 10,
    },
    dataView: {
      width: "100%",
    },
    headerView: {
      flexDirection: "row",
      padding: 5,
    },
    titleView: { marginLeft: 10 },
    icon: {
      flex: 1,
      alignItems: "center",
    },
    rowView: {
      marginTop: 10,
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-between",
      marginHorizontal: 10,
    },
    title: {
      color: "white",
      fontFamily: "Inter-Medium",
      marginLeft: 5,
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
