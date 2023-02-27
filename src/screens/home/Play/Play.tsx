import React, { useState, Dispatch, SetStateAction } from "react";
import { StyleSheet, View, Image, ScrollView, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { DateTimePickerView } from "./DateTimePickerView";

export const Play = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [selectedSport, setSelectedSport] = useState<
    "basketball" | "football" | "tennis"
  >("basketball");
  const [dateTimePickerVisible, setDateTimePickerVisible] =
    useState<boolean>(false);

  return (
    <React.Fragment>
      <Pressable
        style={[styles.backgroundView, { display: visible ? "flex" : "none" }]}
        onPress={() => {
          setVisible(false);
        }}
      />
      <View
        style={[styles.wrapperView, { display: visible ? "flex" : "none" }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create a Game</Text>
          <Feather
            name="x"
            size={24}
            color={"white"}
            style={{ position: "absolute", right: 0 }}
            onPress={() => setVisible(false)}
          />
        </View>
        <ScrollView style={styles.typePicker} horizontal>
          <Pressable
            onPress={() => {
              setSelectedSport("basketball");
            }}
            style={[
              styles.sportType,
              { marginLeft: 20 },
              selectedSport === "basketball"
                ? { borderColor: colors.primary }
                : {},
            ]}
          >
            <Text
              style={[
                styles.sportText,
                selectedSport === "basketball" ? { color: colors.primary } : {},
              ]}
            >
              Basketball
            </Text>
            <Image
              source={require("assets/images/home/basketball.png")}
              style={{ width: 30, height: 30 }}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              setSelectedSport("football");
            }}
            style={[
              styles.sportType,
              selectedSport === "football"
                ? { borderColor: colors.primary }
                : {},
            ]}
          >
            <Text
              style={[
                styles.sportText,
                selectedSport === "football" ? { color: colors.primary } : {},
              ]}
            >
              Football
            </Text>
            <Image
              source={require("assets/images/home/football.png")}
              style={{ width: 30, height: 30 }}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              setSelectedSport("tennis");
            }}
            style={[
              styles.sportType,
              { marginRight: 20 },
              selectedSport === "tennis" ? { borderColor: colors.primary } : {},
            ]}
          >
            <Text
              style={[
                styles.sportText,
                selectedSport === "tennis" ? { color: colors.primary } : {},
              ]}
            >
              Tennis
            </Text>
            <Image
              source={require("assets/images/home/tennis.png")}
              style={{ width: 30, height: 30 }}
            />
          </Pressable>
        </ScrollView>
        <View style={styles.contentView}>
          <View style={styles.contentIconView}>
            <IonIcon
              name={"location-outline"}
              size={20}
              color={"white"}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.labelText}>Nearby: Beirut, Lebanon</Text>
          </View>
          <Text style={styles.buttonText}>Change</Text>
        </View>
        <View style={styles.contentView}>
          <View style={styles.contentIconView}>
            <MatComIcon
              name={"account-outline"}
              size={20}
              color={"white"}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.labelText}>How many players?</Text>
          </View>
          <View style={styles.contentIconView}>
            <Feather name="minus-circle" color={colors.primary} size={24} />
            <Text
              style={[styles.labelText, { fontSize: 18, marginHorizontal: 10 }]}
            >
              6
            </Text>
            <Feather name="plus-circle" color={colors.primary} size={24} />
          </View>
        </View>
        <View style={styles.dateTime}>
          <View style={styles.dateTimeRow}>
            <Text style={styles.labelText}>Date</Text>
            <Text
              style={styles.buttonText}
              onPress={() => setDateTimePickerVisible(true)}
            >
              Select Date
            </Text>
          </View>
          <View style={styles.dateTimeRow}>
            <Text style={styles.labelText}>Time slot</Text>
            <Text
              style={styles.buttonText}
              onPress={() => setDateTimePickerVisible(true)}
            >
              Select Time
            </Text>
          </View>
        </View>
      </View>
      <DateTimePickerView
        visible={dateTimePickerVisible}
        setVisible={setDateTimePickerVisible}
      />
    </React.Fragment>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    backgroundView: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "black",
      opacity: 0.5,
    },
    wrapperView: {
      position: "absolute",
      bottom: 0,
      height: "85%",
      width: "100%",
      backgroundColor: colors.background,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 20,
    },
    header: {
      margin: 20,
      marginBottom: 40,
      flexDirection: "row",
      justifyContent: "center",
    },
    title: {
      fontFamily: "Inter-SemiBold",
      color: "white",
      fontSize: 16,
    },
    typePicker: {
      flexGrow: 0,
      marginHorizontal: -20,
    },
    sportType: {
      backgroundColor: colors.secondary,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      borderColor: colors.tertiary,
      borderWidth: 0.5,
      padding: 15,
      marginHorizontal: 5,
    },
    sportText: {
      fontFamily: "Inter-SemiBold",
      fontSize: 16,
      marginRight: 10,
      color: "white",
    },
    contentView: {
      backgroundColor: colors.secondary,
      marginTop: 15,
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: 10,
      borderColor: colors.tertiary,
      borderWidth: 0.5,
    },
    contentIconView: {
      flexDirection: "row",
      alignItems: "center",
    },
    labelText: {
      fontFamily: "Inter-Medium",
      color: "white",
    },
    buttonText: {
      fontFamily: "Inter-Medium",
      color: colors.primary,
    },
    dateTime: {
      backgroundColor: colors.secondary,
      marginTop: 15,
      padding: 20,
      borderRadius: 10,
      borderColor: colors.tertiary,
      borderWidth: 0.5,
    },
    dateTimeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 10,
    },
  });
