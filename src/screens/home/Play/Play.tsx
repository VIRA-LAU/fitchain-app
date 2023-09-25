import React, {
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
  useEffect,
} from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
  useWindowDimensions,
} from "react-native";
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
import { BottomTabParamList, StackParamList } from "src/navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Branch, GameType, TimeSlot } from "src/types";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  BottomModal,
  MapComponent,
  TimeSlotPicker,
  getMins,
  parseTimeFromMinutes,
} from "src/components";
import { LatLng, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useLocationNameQuery } from "src/api";
import CalendarPicker from "react-native-calendar-picker";
import { Slider } from "@miblanchard/react-native-slider";

export const Play = ({
  visible,
  setVisible,
  branch,
  setPlayScreenStillVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setPlayScreenStillVisible?: Dispatch<SetStateAction<boolean>>;
  branch?: Branch;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [gameType, setGameType] = useState<GameType>("Basketball");
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [timeSlotPickerVisible, setTimeSlotPickerVisible] = useState(false);

  useEffect(() => {
    if (branch) setGameType(branch?.courts[0].courtType);
  }, [JSON.stringify(branch)]);

  const [searchDate, setSearchDate] = useState<Date | null>(new Date());
  const [searchTime, setSearchTime] = useState<TimeSlot>();
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);

  const [mapDisplayed, setMapDisplayed] = useState<boolean>(false);
  const [searchLocationMarker, setSearchLocationMarker] = useState<LatLng>();
  const [initialMapRegion, setInitialMapRegion] = useState<Region>({
    latitude: 33.895462996463095,
    longitude: 35.5006168037653,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const { data: searchLocationName, refetch: getLocationName } =
    useLocationNameQuery(searchLocationMarker);

  useEffect(() => {
    const getUserLocation = async () => {
      let location = await Location.getLastKnownPositionAsync();
      if (location) {
        setSearchLocationMarker(location.coords);
        setInitialMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else setSearchLocationMarker(initialMapRegion);
    };
    getUserLocation();
  }, []);

  useEffect(() => {
    if (searchLocationMarker) getLocationName();
  }, [JSON.stringify(searchLocationMarker)]);

  const [selectedDate, selectedTime] = useMemo(() => {
    let [date, time]: (string | null)[] = [null, null];
    if (searchDate) {
      date = searchDate
        .toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .slice(0, Platform.OS === "ios" ? -5 : -6);
    }
    if (searchTime) {
      time = `${parseTimeFromMinutes(
        getMins(searchTime.startTime as Date)
      )} - ${parseTimeFromMinutes(getMins(searchTime.endTime as Date))}`;
    }

    return [date, time];
  }, [searchDate, searchTime]);

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<StackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  return (
    <BottomModal
      visible={visible}
      setVisible={setVisible}
      setPlayScreenStillVisible={setPlayScreenStillVisible}
      onClose={() => {
        setMapDisplayed(false);
      }}
    >
      <ScrollView
        style={styles.wrapperView}
        contentContainerStyle={styles.wrapperViewContent}
      >
        <View style={styles.header}>
          {mapDisplayed && (
            <TouchableOpacity
              style={{ position: "absolute", left: 0 }}
              onPress={() => {
                setMapDisplayed(false);
              }}
            >
              <MaterialIcon
                name="arrow-back"
                color={colors.tertiary}
                size={24}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{!branch && "Find or "}Create a Game</Text>
          <TouchableOpacity
            style={{ position: "absolute", right: 0 }}
            onPress={() => {
              setVisible(false);
              setMapDisplayed(false);
            }}
          >
            <Feather name="x" size={24} color={colors.tertiary} />
          </TouchableOpacity>
        </View>
        {!mapDisplayed ? (
          <View style={styles.createView}>
            <ScrollView
              style={styles.typePicker}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              <View style={{ flexDirection: "row", marginHorizontal: 15 }}>
                {branch?.courts.findIndex(
                  (court) => court.courtType === "Basketball"
                ) !== -1 && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setGameType("Basketball");
                    }}
                    style={[
                      styles.sportType,
                      gameType === "Basketball" && {
                        borderColor: colors.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sportText,
                        gameType === "Basketball" && {
                          color: colors.primary,
                        },
                      ]}
                    >
                      Basketball
                    </Text>
                    <Image
                      source={require("assets/images/home/basketball.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableOpacity>
                )}
                {branch?.courts.findIndex(
                  (court) => court.courtType === "Football"
                ) !== -1 && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setGameType("Football");
                    }}
                    style={[
                      styles.sportType,
                      gameType === "Football" && {
                        borderColor: colors.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sportText,
                        gameType === "Football" && { color: colors.primary },
                      ]}
                    >
                      Football
                    </Text>
                    <Image
                      source={require("assets/images/home/football.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableOpacity>
                )}
                {branch?.courts.findIndex(
                  (court) => court.courtType === "Tennis"
                ) !== -1 && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setGameType("Tennis");
                    }}
                    style={[
                      styles.sportType,
                      gameType === "Tennis" && {
                        borderColor: colors.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sportText,
                        gameType === "Tennis" && { color: colors.primary },
                      ]}
                    >
                      Tennis
                    </Text>
                    <Image
                      source={require("assets/images/home/tennis.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
            {!branch && (
              <View style={styles.contentView}>
                <View style={styles.contentIconView}>
                  <IonIcon
                    name={"location-outline"}
                    size={20}
                    color={colors.tertiary}
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
                    Nearby:{" "}
                    {!searchLocationName ? "Loading..." : searchLocationName}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setMapDisplayed(true)}
                  disabled={!searchLocationName}
                  style={{ justifyContent: "center" }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      searchLocationMarker &&
                      searchLocationName &&
                      initialMapRegion
                        ? { color: colors.primary }
                        : { color: colors.tertiary },
                    ]}
                  >
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.contentView}>
              <View style={styles.contentIconView}>
                <MatComIcon
                  name={"account-outline"}
                  size={20}
                  color={colors.tertiary}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.labelText}>How many players?</Text>
              </View>
              <Slider
                containerStyle={{ flexGrow: 1, marginLeft: 20 }}
                step={1}
                minimumValue={1}
                maximumValue={12}
                value={numberOfPlayers}
                onValueChange={(data) => {
                  setNumberOfPlayers(data[0]);
                }}
                minimumTrackTintColor={colors.tertiary}
                maximumTrackTintColor={colors.tertiary}
                thumbTintColor={colors.primary}
                renderAboveThumbComponent={(data, index) => {
                  return (
                    <View
                      style={{
                        transform: [{ translateX: 15 }, { translateY: 10 }],
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Poppins-Regular",
                          color: colors.tertiary,
                        }}
                      >
                        {index}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
            <View style={styles.dateTime}>
              <View style={styles.dateTimeRow}>
                <Text style={styles.labelText}>Date</Text>
                {searchDate && (
                  <TouchableOpacity
                    style={styles.resetView}
                    onPress={() => {
                      setSearchDate(null);
                    }}
                  >
                    <Text style={styles.reset}>Reset</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => setDateTimePickerVisible(true)}
                >
                  <Text style={styles.buttonText}>
                    {selectedDate ? selectedDate : "Any Date"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dateTimeRow}>
                <Text style={styles.labelText}>Time</Text>
                {searchTime && (
                  <TouchableOpacity
                    style={styles.resetView}
                    onPress={() => {
                      setSearchTime(undefined);
                    }}
                  >
                    <Text style={styles.reset}>Reset</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => setTimeSlotPickerVisible(true)}
                  disabled={searchDate === null || searchDate === undefined}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: searchDate ? colors.primary : colors.tertiary,
                      },
                    ]}
                  >
                    {selectedTime || "Any Time"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.buttonView}>
              <Button
                mode="contained"
                buttonColor={searchDate ? colors.primary : colors.tertiary}
                style={{ width: "100%" }}
                onPress={
                  searchDate && searchLocationMarker && searchLocationName
                    ? () => {
                        if (setPlayScreenStillVisible)
                          setPlayScreenStillVisible(true);
                        setVisible(false);
                        if (!branch)
                          navigation.push("ChooseBranch", {
                            date: searchDate.toISOString(),
                            gameType,
                            location: searchLocationMarker,
                            locationName: searchLocationName,
                            time: searchTime
                              ? {
                                  startTime: (
                                    searchTime?.startTime as Date
                                  ).toISOString(),
                                  endTime: (
                                    searchTime?.endTime as Date
                                  ).toISOString(),
                                }
                              : undefined,
                            nbOfPlayers: numberOfPlayers,
                          });
                        else {
                          navigation.push("ChooseCourt", {
                            branchId: branch.id,
                            venueName: branch.venue.name,
                            branchLocation: branch.location,
                            bookingDetails: {
                              date: searchDate.toISOString(),
                              nbOfPlayers: numberOfPlayers,
                              time: searchTime
                                ? {
                                    startTime: (
                                      searchTime?.startTime as Date
                                    ).toISOString(),
                                    endTime: (
                                      searchTime?.endTime as Date
                                    ).toISOString(),
                                  }
                                : undefined,
                              gameType,
                            },
                            profilePhotoUrl: branch.profilePhotoUrl,
                          });
                        }
                      }
                    : undefined
                }
              >
                {branch ? "Find a Court" : "Find Venue"}
              </Button>
              {!branch && (
                <Button
                  mode="contained"
                  style={{ width: "100%", marginTop: 15 }}
                  onPress={() => {
                    if (setPlayScreenStillVisible)
                      setPlayScreenStillVisible(true);
                    setVisible(false);
                    if (!branch && searchLocationMarker && searchLocationName)
                      navigation.push("ChooseGame", {
                        date: searchDate ? searchDate.toISOString() : undefined,
                        gameType,
                        nbOfPlayers: numberOfPlayers,
                        location: searchLocationMarker,
                        locationName: searchLocationName,
                        time: searchTime
                          ? {
                              startTime: (
                                searchTime?.startTime as Date
                              ).toISOString(),
                              endTime: (
                                searchTime?.endTime as Date
                              ).toISOString(),
                            }
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
            setMapDisplayed={setMapDisplayed}
            region={initialMapRegion}
            setRegion={setInitialMapRegion}
          />
        )}
      </ScrollView>

      {Platform.OS === "ios" ? (
        <DateTimePickerModal
          isVisible={dateTimePickerVisible !== false}
          mode={"date"}
          date={searchDate || new Date()}
          minimumDate={new Date()}
          onConfirm={(date) => {
            setDateTimePickerVisible(false);
            setSearchDate(date);
          }}
          onCancel={() => {
            setDateTimePickerVisible(false);
          }}
          pickerContainerStyleIOS={{
            backgroundColor: colors.secondary,
          }}
          buttonTextColorIOS={colors.primary}
          textColor={colors.tertiary}
          style={{
            backgroundColor: colors.secondary,
          }}
          customCancelButtonIOS={(props) => (
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.secondary : colors.background,
                padding: 15,
                borderRadius: 10,
              })}
              onPress={() => {
                setDateTimePickerVisible(false);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </Pressable>
          )}
        />
      ) : (
        <BottomModal
          visible={dateTimePickerVisible}
          setVisible={setDateTimePickerVisible}
        >
          <View
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              paddingVertical: 40,
              marginTop: "auto",
            }}
          >
            <CalendarPicker
              width={useWindowDimensions().width - 40}
              textStyle={{ color: colors.tertiary }}
              minDate={new Date()}
              todayBackgroundColor={colors.tertiary}
              selectedDayStyle={{ backgroundColor: colors.primary }}
              initialDate={searchDate ?? new Date()}
              onDateChange={(date) => {
                const parsedDate = date.toDate();
                setDateTimePickerVisible(false);
                setSearchDate(parsedDate);
              }}
              selectedStartDate={searchDate ?? new Date()}
            />
          </View>
        </BottomModal>
      )}

      <TimeSlotPicker
        visible={timeSlotPickerVisible}
        setVisible={setTimeSlotPickerVisible}
        time={searchTime}
        onPress={(tempTime) => {
          setSearchTime(tempTime);
          setTimeSlotPickerVisible(false);
        }}
      />
    </BottomModal>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexGrow: 0,
      marginTop: "auto",
      height: "75%",
      width: "100%",
    },
    wrapperViewContent: {
      flexGrow: 1,
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
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
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
      fontFamily: "Poppins-Bold",
      fontSize: 16,
      lineHeight: 16,
      marginRight: 10,
      color: colors.tertiary,
    },
    createView: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20 },
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
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
    buttonText: {
      fontFamily: "Poppins-Regular",
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
      marginTop: "auto",
      paddingTop: 20,
      width: "100%",
    },
    resetView: {
      marginLeft: "auto",
      marginRight: 15,
    },
    reset: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
  });
