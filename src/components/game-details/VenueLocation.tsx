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

export const VenueLocation = () => {
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
            <Text style={styles.title}>Hoops Club</Text>
            <Text style={styles.subtitle}>Hazmieh</Text>
          </View>
        </View>
        <View style={styles.rowView}>
          <Text style={styles.rowKey}>COURT</Text>
          <Text style={styles.rowValue}>A003</Text>
        </View>
        <View style={styles.rowView}>
          <Text style={styles.rowKey}>SIDE</Text>
          <Text style={styles.rowValue}>Away</Text>
        </View>
        <View style={styles.rowView}>
          <Text style={styles.rowKey}>PRICE</Text>
          <Text style={styles.rowValue}>USD 12/hr</Text>
        </View>
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