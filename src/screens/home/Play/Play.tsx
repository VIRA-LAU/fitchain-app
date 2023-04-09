import React, {
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
  useEffect,
} from "react";
import { StyleSheet, View, Image, ScrollView, Pressable } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { GameType } from "src/types";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MapComponent } from "src/components";
import { LatLng, Region } from "react-native-maps";
import * as Location from "expo-location";
import { getLocationName } from "src/api";

const timeFormatter = (date: Date, hourMode: "12" | "24" = "12") => {
  if (hourMode === "12") {
    const hours =
      date.getHours() % 12 === 0
        ? "12"
        : ("0" + (date.getHours() % 12)).slice(-2);
    return `${hours}:${("0" + date.getMinutes()).slice(-2)} ${
      date.getHours() >= 12 ? "PM" : "AM"
    }`;
  } else {
    return `${("0" + date.getHours()).slice(-2)}:${(
      "0" + date.getMinutes()
    ).slice(-2)}`;
  }
};

export const Play = ({
  visible,
  setVisible,
  venueId = undefined,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  venueId?: number | undefined;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [gameType, setGameType] = useState<GameType>("Basketball");
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState<
    "date" | "startTime" | "endTime" | false
  >(false);

  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [startTimeDate, setStartTimeDate] = useState<Date | null>(null);
  const [endTimeDate, setEndTimeDate] = useState<Date | null>(null);
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);

  const [mapDisplayed, setMapDisplayed] = useState<boolean>(false);
  const [searchLocationName, setSearchLocationName] = useState<string>();
  const [searchLocationMarker, setSearchLocationMarker] = useState<LatLng>();
  const [initialMapRegion, setInitialMapRegion] = useState<Region>();

  useEffect(() => {
    const getUserLocation = async () => {
      let location = await Location.getCurrentPositionAsync();
      setSearchLocationMarker(location.coords);
      const locationName = await getLocationName(location.coords);
      setSearchLocationName(locationName);
      setInitialMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };
    getUserLocation();
  }, []);

  const [selectedDate, selectedStartTime, selectedEndTime] = useMemo(() => {
    let [date, startTime, endTime]: (string | null)[] = [null, null, null];
    if (searchDate) {
      date = searchDate
        .toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .slice(0, -6);
    }
    if (startTimeDate) {
      startTime = timeFormatter(startTimeDate);
    }
    if (endTimeDate) {
      endTime = timeFormatter(endTimeDate);
    }
    return [date, startTime, endTime];
  }, [searchDate, startTimeDate, endTimeDate]);

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  if (!searchLocationMarker || !searchLocationName || !initialMapRegion)
    return <View></View>;
  return (
    <React.Fragment>
      <Pressable
        style={[styles.backgroundView, { display: visible ? "flex" : "none" }]}
        onPress={() => {
          setVisible(false);
          setMapDisplayed(false);
        }}
      />
      <View
        style={[styles.wrapperView, { display: visible ? "flex" : "none" }]}
      >
        <View style={styles.header}>
          {mapDisplayed && (
            <MaterialIcon
              name="arrow-back"
              color={"white"}
              size={24}
              style={{ position: "absolute", left: 0 }}
              onPress={() => {
                setMapDisplayed(false);
              }}
            />
          )}
          <Text style={styles.title}>Create a Game</Text>
          <Feather
            name="x"
            size={24}
            color={"white"}
            style={{ position: "absolute", right: 0 }}
            onPress={() => {
              setVisible(false);
              setMapDisplayed(false);
            }}
          />
        </View>
        {!mapDisplayed ? (
          <View style={styles.createView}>
            <ScrollView
              style={styles.typePicker}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              <Pressable
                onPress={() => {
                  setGameType("Basketball");
                }}
                style={[
                  styles.sportType,
                  { marginLeft: 20 },
                  gameType === "Basketball"
                    ? { borderColor: colors.primary }
                    : {},
                ]}
              >
                <Text
                  style={[
                    styles.sportText,
                    gameType === "Basketball" ? { color: colors.primary } : {},
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
                  setGameType("Football");
                }}
                style={[
                  styles.sportType,
                  gameType === "Football"
                    ? { borderColor: colors.primary }
                    : {},
                ]}
              >
                <Text
                  style={[
                    styles.sportText,
                    gameType === "Football" ? { color: colors.primary } : {},
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
                  setGameType("Tennis");
                }}
                style={[
                  styles.sportType,
                  { marginRight: 20 },
                  gameType === "Tennis" ? { borderColor: colors.primary } : {},
                ]}
              >
                <Text
                  style={[
                    styles.sportText,
                    gameType === "Tennis" ? { color: colors.primary } : {},
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
            {!venueId && (
              <View style={styles.contentView}>
                <View style={styles.contentIconView}>
                  <IonIcon
                    name={"location-outline"}
                    size={20}
                    color={"white"}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={[
                      styles.labelText,
                      {
                        minWidth: "75%",
                        maxWidth: "75%",
                      },
                    ]}
                  >
                    Nearby: {searchLocationName}
                  </Text>
                </View>
                <Text
                  style={styles.buttonText}
                  onPress={() => setMapDisplayed(true)}
                >
                  Change
                </Text>
              </View>
            )}
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
                <Feather
                  name="minus-circle"
                  color={colors.primary}
                  size={24}
                  onPress={() => {
                    if (numberOfPlayers > 1)
                      setNumberOfPlayers((oldNum) => oldNum - 1);
                  }}
                />
                <Text
                  style={[
                    styles.labelText,
                    { fontSize: 18, width: 40, textAlign: "center" },
                  ]}
                >
                  {numberOfPlayers}
                </Text>
                <Feather
                  name="plus-circle"
                  color={colors.primary}
                  size={24}
                  onPress={() => {
                    if (numberOfPlayers < 12)
                      setNumberOfPlayers((oldNum) => oldNum + 1);
                  }}
                />
              </View>
            </View>
            <View style={styles.dateTime}>
              <View style={styles.dateTimeRow}>
                <Text style={styles.labelText}>Date</Text>
                {searchDate && (
                  <Text
                    style={styles.reset}
                    onPress={() => {
                      setSearchDate(null);
                      setStartTimeDate(null);
                      setEndTimeDate(null);
                    }}
                  >
                    Reset
                  </Text>
                )}
                <Text
                  style={styles.buttonText}
                  onPress={() => setDateTimePickerVisible("date")}
                >
                  {selectedDate ? selectedDate : "Select Date"}
                </Text>
              </View>
              <View style={styles.dateTimeRow}>
                <Text style={styles.labelText}>Start Time</Text>
                {startTimeDate && (
                  <Text
                    style={styles.reset}
                    onPress={() => {
                      setStartTimeDate(null);
                      setEndTimeDate(null);
                    }}
                  >
                    Reset
                  </Text>
                )}
                <Text
                  style={[
                    styles.buttonText,
                    searchDate
                      ? { color: colors.primary }
                      : { color: colors.tertiary },
                  ]}
                  onPress={
                    searchDate
                      ? () => setDateTimePickerVisible("startTime")
                      : undefined
                  }
                >
                  {selectedStartTime ? selectedStartTime : "Select Time"}
                </Text>
              </View>
              <View style={styles.dateTimeRow}>
                <Text style={styles.labelText}>End Time</Text>
                <Text
                  style={[
                    styles.buttonText,
                    startTimeDate
                      ? { color: colors.primary }
                      : { color: colors.tertiary },
                  ]}
                  onPress={
                    startTimeDate
                      ? () => setDateTimePickerVisible("endTime")
                      : undefined
                  }
                >
                  {selectedEndTime ? selectedEndTime : "Select Time"}
                </Text>
              </View>
            </View>
            <View style={styles.buttonView}>
              <Button
                buttonColor={searchDate ? colors.primary : colors.tertiary}
                textColor={"black"}
                style={{ borderRadius: 5, width: !venueId ? "49%" : "100%" }}
                onPress={
                  searchDate
                    ? () => {
                        setVisible(false);
                        navigation.push("ChooseVenue", {
                          venueId,
                          date: JSON.stringify(searchDate),
                          gameType,
                          location: searchLocationMarker,
                          locationName: searchLocationName,
                          startTime: startTimeDate
                            ? timeFormatter(startTimeDate, "24")
                            : undefined,
                          endTime: endTimeDate
                            ? timeFormatter(endTimeDate, "24")
                            : undefined,
                        });
                      }
                    : undefined
                }
              >
                {venueId ? "Find a Branch" : "Find Venue"}
              </Button>
              {!venueId && (
                <Button
                  buttonColor={colors.primary}
                  textColor={"black"}
                  style={{ borderRadius: 5, width: "49%", marginLeft: "2%" }}
                  onPress={() => {
                    setVisible(false);
                    if (!venueId)
                      navigation.push("ChooseGame", {
                        date: searchDate
                          ? JSON.stringify(searchDate)
                          : undefined,
                        gameType,
                        location: searchLocationMarker,
                        locationName: searchLocationName,
                        startTime: startTimeDate
                          ? timeFormatter(startTimeDate, "24")
                          : undefined,
                        endTime: endTimeDate
                          ? timeFormatter(endTimeDate, "24")
                          : undefined,
                      });
                  }}
                >
                  Find Game
                </Button>
              )}
            </View>
          </View>
        ) : (
          <MapComponent
            locationMarker={searchLocationMarker}
            setLocationMarker={setSearchLocationMarker}
            setLocationName={setSearchLocationName}
            setMapDisplayed={setMapDisplayed}
            region={initialMapRegion}
            setRegion={setInitialMapRegion}
          />
        )}
      </View>

      <DateTimePickerModal
        isVisible={dateTimePickerVisible !== false}
        mode={
          dateTimePickerVisible
            ? dateTimePickerVisible === "date"
              ? "date"
              : "time"
            : "date"
        }
        date={
          dateTimePickerVisible === "date" && searchDate
            ? searchDate
            : dateTimePickerVisible === "startTime" && startTimeDate
            ? startTimeDate
            : dateTimePickerVisible === "endTime" && endTimeDate
            ? endTimeDate
            : new Date()
        }
        onConfirm={(date) => {
          setDateTimePickerVisible(false);
          if (dateTimePickerVisible === "date") {
            setSearchDate(date);
          } else if (dateTimePickerVisible === "startTime") {
            setStartTimeDate(date);
            if (!endTimeDate || endTimeDate < date) {
              let endDate = new Date(date);
              endDate.setHours(endDate.getHours() + 1);
              setEndTimeDate(endDate);
            }
          } else {
            if (startTimeDate && date < startTimeDate) {
              setEndTimeDate(startTimeDate);
            } else setEndTimeDate(date);
          }
        }}
        onCancel={() => {
          setDateTimePickerVisible(false);
        }}
        isDarkModeEnabled={true}
        accentColor={colors.primary}
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
      height: "75%",
      width: "100%",
      backgroundColor: colors.background,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      paddingTop: 20,
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
      lineHeight: 16,
      marginRight: 10,
      color: "white",
    },
    createView: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 30 },
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
      textAlignVertical: "center",
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
    buttonView: {
      // flexDirection: 'row',
      marginTop: 20,
      flex: 1,
    },
    reset: {
      marginLeft: "auto",
      marginRight: 15,
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
    },
  });
