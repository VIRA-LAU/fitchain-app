import { StackScreenProps } from "@react-navigation/stack";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { AppHeader, BranchCard, BranchCardSkeleton } from "src/components";
import { StackParamList } from "src/navigation";
import { Branch, GameType } from "src/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useSearchBranchesQuery } from "src/api";

type Props = StackScreenProps<StackParamList, "BookCourt">;

const stageTitles = [
  "Type of Sport",
  "Type of Court",
  "Dates",
  "",
  "",
  "Invite Friends",
  "",
];

const GameTypeCard = ({
  gameType,
  selectedGameType,
  setGameType,
}: {
  gameType: GameType;
  selectedGameType: GameType;
  setGameType: Dispatch<SetStateAction<GameType>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.gameType,
        gameType === selectedGameType
          ? {
              backgroundColor: colors.primary,
            }
          : {},
      ]}
      onPress={() => setGameType(gameType)}
    >
      <Text
        style={[
          styles.title,
          gameType === selectedGameType
            ? {
                color: colors.background,
              }
            : {},
        ]}
      >
        {gameType}
      </Text>
    </TouchableOpacity>
  );
};

const CourtType = ({
  courtType,
  selectedCourtType,
  setCourtType,
}: {
  courtType: "Half Court" | "Full Court";
  selectedCourtType: "Half Court" | "Full Court";
  setCourtType: Dispatch<SetStateAction<"Half Court" | "Full Court">>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.gameType,
        courtType === selectedCourtType
          ? {
              backgroundColor: colors.primary,
            }
          : {},
      ]}
      onPress={() => setCourtType(courtType)}
    >
      <Text
        style={[
          styles.title,
          courtType === selectedCourtType
            ? {
                color: colors.background,
              }
            : {},
        ]}
      >
        {courtType}
      </Text>
    </TouchableOpacity>
  );
};

const TimeCard = ({
  time,
  selectedTime,
  setTime,
}: {
  time: string;
  selectedTime: string;
  setTime: Dispatch<SetStateAction<string>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.gameType,
        { minWidth: 112, alignItems: "center", marginBottom: 0 },
        time === selectedTime
          ? {
              backgroundColor: colors.primary,
            }
          : {},
      ]}
      onPress={() => setTime(time)}
    >
      <Text
        style={[
          styles.title,
          time === selectedTime
            ? {
                color: colors.background,
              }
            : {},
        ]}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );
};

const DurationCard = ({
  duration,
  selectedDuration,
  setDuration,
}: {
  duration: number;
  selectedDuration: number;
  setDuration: Dispatch<SetStateAction<number>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.gameType,
        { minWidth: 112, alignItems: "center", marginBottom: 0 },
        duration === selectedDuration
          ? {
              backgroundColor: colors.primary,
            }
          : {},
      ]}
      onPress={() => setDuration(duration)}
    >
      <Text
        style={[
          styles.title,
          duration === selectedDuration
            ? {
                color: colors.background,
              }
            : {},
        ]}
      >
        {duration === 0.5
          ? "30 mins"
          : duration === 1
          ? "1 hour"
          : `${duration} hours`}
      </Text>
    </TouchableOpacity>
  );
};

export const BookCourt = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { width: windowWidth } = useWindowDimensions();

  const { data } = route.params;
  const stage = data?.stage ?? 0;

  const [gameType, setGameType] = useState<GameType>(
    data?.gameType ?? "Basketball"
  );
  const [courtType, setCourtType] = useState<"Half Court" | "Full Court">(
    data?.courtType ?? "Half Court"
  );
  const [searchDate, setSearchDate] = useState<Date>(
    data?.searchDate ? new Date(data.searchDate) : new Date()
  );
  const [selectedStartTime, setSelectedStartTime] = useState<string>(
    data?.selectedStartTime ?? "08:00"
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(
    data?.selectedDuration ?? 0.5
  );
  const [branchSearchText, setBranchSearchText] = useState<string>(
    data?.branchSearchText ?? ""
  );
  const [selectedBranch, setSelectedBranch] = useState<Branch>();

  const searchStartTime = new Date(searchDate);
  searchStartTime.setHours(
    parseInt(selectedStartTime.substring(0, selectedStartTime.indexOf(":"))),
    parseInt(selectedStartTime.substring(selectedStartTime.indexOf(":") + 1)),
    0,
    0
  );

  var endTimeMins =
    parseInt(selectedStartTime.substring(selectedStartTime.indexOf(":") + 1)) +
    selectedDuration * 60;
  var endTimeHours = Math.floor(endTimeMins / 60);
  endTimeMins = endTimeMins % 60;

  const searchEndTime = new Date(searchDate);
  searchEndTime.setHours(
    parseInt(selectedStartTime.substring(0, selectedStartTime.indexOf(":"))) +
      endTimeHours,
    endTimeMins,
    0,
    0
  );

  const timeSlotStartTime = new Date("2000-01-01");
  timeSlotStartTime.setHours(
    parseInt(selectedStartTime.substring(0, selectedStartTime.indexOf(":"))),
    parseInt(selectedStartTime.substring(selectedStartTime.indexOf(":") + 1)),
    0,
    0
  );

  const timeSlotEndTime = new Date("2000-01-01");
  timeSlotEndTime.setHours(
    parseInt(selectedStartTime.substring(0, selectedStartTime.indexOf(":"))) +
      endTimeHours,
    endTimeMins,
    0,
    0
  );

  const {
    data: branches,
    isLoading: branchesLoading,
    refetch: fetchBranches,
  } = useSearchBranchesQuery({
    date: `${searchDate.getFullYear()}-${(
      "0" +
      (searchDate.getMonth() + 1)
    ).slice(-2)}-${("0" + searchDate.getDate()).slice(-2)}`,
    gameType,
    startTime: timeSlotStartTime.toISOString(),
    endTime: timeSlotEndTime.toISOString(),
    nbOfPlayers: 1,
  });

  useEffect(() => {
    if (stage === 3) fetchBranches();
  }, [stage]);

  return (
    <AppHeader absolutePosition={false} title={"Book a Court"} backEnabled>
      <View style={styles.stageBarBack}>
        <View
          style={[styles.stageBar, { width: (windowWidth / 4) * (stage + 1) }]}
        />
      </View>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {stage <= 2 && (
          <Text style={[styles.title, { marginBottom: 16 }]}>
            {stageTitles[stage]}
          </Text>
        )}
        {stage === 0 && (
          <View style={styles.gameTypes}>
            <GameTypeCard
              gameType="Basketball"
              selectedGameType={gameType}
              setGameType={setGameType}
            />
            <GameTypeCard
              gameType="Football"
              selectedGameType={gameType}
              setGameType={setGameType}
            />
            <GameTypeCard
              gameType="Tennis"
              selectedGameType={gameType}
              setGameType={setGameType}
            />
            {/* <GameType
              gameType="Padel Tennis"
              selectedGameType={gameType}
              setGameType={setGameType}
            />
            <GameType
              gameType="Volleyball"
              selectedGameType={gameType}
              setGameType={setGameType}
            /> */}
          </View>
        )}
        {stage === 1 && (
          <View style={styles.gameTypes}>
            <CourtType
              courtType="Half Court"
              selectedCourtType={courtType}
              setCourtType={setCourtType}
            />
            <CourtType
              courtType="Full Court"
              selectedCourtType={courtType}
              setCourtType={setCourtType}
            />
          </View>
        )}
        {stage === 2 && (
          <View style={{ marginBottom: 16 }}>
            <CalendarPicker
              width={windowWidth * 0.9}
              textStyle={{
                color: colors.tertiary,
                fontFamily: "Poppins-Medium",
              }}
              minDate={new Date()}
              todayBackgroundColor={colors.secondary}
              selectedDayStyle={{ backgroundColor: colors.primary }}
              selectedDayTextColor={colors.background}
              initialDate={searchDate ?? new Date()}
              onDateChange={(date) => {
                const parsedDate = date.toDate();
                setSearchDate(parsedDate);
              }}
              selectedStartDate={searchDate ?? new Date()}
            />
            <Text style={[styles.title, { marginTop: 24, marginBottom: 16 }]}>
              Start Time
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                "08:00",
                "08:30",
                "09:00",
                "09:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
                "12:00",
                "12:30",
                "13:00",
                "13:30",
                "14:00",
                "14:30",
                "15:00",
                "15:30",
                "16:00",
                "16:30",
                "17:00",
                "17:30",
                "18:00",
                "18:30",
                "19:00",
                "19:30",
                "20:00",
                "20:30",
                "21:00",
                "21:30",
                "22:00",
                "22:30",
              ].map((time, index) => (
                <TimeCard
                  key={index}
                  time={time}
                  setTime={setSelectedStartTime}
                  selectedTime={selectedStartTime}
                />
              ))}
            </ScrollView>
            <Text style={[styles.title, { marginTop: 24, marginBottom: 16 }]}>
              Duration
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[0.5, 1, 1.5, 2].map((duration, index) => (
                <DurationCard
                  key={index}
                  duration={duration}
                  setDuration={setSelectedDuration}
                  selectedDuration={selectedDuration}
                />
              ))}
            </ScrollView>
          </View>
        )}
        {stage === 3 && (
          <View style={{ marginBottom: 16 }}>
            <View style={styles.searchView}>
              <View style={styles.searchBarView}>
                <TextInput
                  style={styles.searchBar}
                  value={branchSearchText}
                  placeholder="Search"
                  placeholderTextColor={colors.tertiary}
                  cursorColor={colors.primary}
                  onChangeText={setBranchSearchText}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={branchSearchText === ""}
                  onPress={() => {
                    setBranchSearchText("");
                  }}
                >
                  <IonIcon
                    name={branchSearchText ? "close-outline" : "search-outline"}
                    color={colors.primary}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <IonIcon
                  name="filter-sharp"
                  size={18}
                  color={colors.onPrimary}
                />
              </TouchableOpacity>
            </View>
            <View>
              {branchesLoading && <BranchCardSkeleton type="horizontal" />}
              {!branchesLoading &&
                branches?.map((branch: Branch, index: number) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={index}
                    onPress={() => setSelectedBranch(branch)}
                  >
                    <BranchCard
                      type="horizontal"
                      promoted={false}
                      branch={branch}
                      pressable={false}
                      isSelected={selectedBranch?.id === branch.id}
                    />
                  </TouchableOpacity>
                ))}
              {!branchesLoading && (!branches || branches.length === 0) && (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    There are no courts that match your search.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        <View style={styles.nextView}>
          <Button
            mode="contained"
            style={styles.next}
            onPress={() => {
              if (stage < 3)
                navigation.push("BookCourt", {
                  data: {
                    stage: stage + 1,
                    gameType,
                    courtType,
                    searchDate: searchDate.toISOString(),
                    selectedStartTime,
                    selectedDuration,
                    branchSearchText,
                  },
                });
              else if (selectedBranch)
                navigation.push("BookingPayment", {
                  venueName: selectedBranch.venue.name,
                  courtName: gameType,
                  courtType: gameType,
                  courtRating: selectedBranch.courts[0].rating,
                  courtMaxPlayers: 1,
                  price: selectedBranch.courts[0].price,
                  branchLatLng: [
                    selectedBranch.latitude,
                    selectedBranch.longitude,
                  ],
                  bookingDetails: {
                    date: searchDate.toISOString(),
                    gameType: gameType,
                    nbOfPlayers: 3,
                    time: {
                      startTime: searchStartTime.toISOString(),
                      endTime: searchEndTime.toISOString(),
                    },
                    courtId: selectedBranch.courts[0].id,
                  },
                  profilePhotoUrl: selectedBranch.profilePhotoUrl,
                });
            }}
          >
            Next
          </Button>
        </View>
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: { flexGrow: 1, padding: 16 },
    stageBarBack: {
      width: "100%",
      height: 8,
      backgroundColor: colors.secondary,
    },
    stageBar: {
      height: 8,
      backgroundColor: colors.primary,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },
    title: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
    },
    text: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
    nextView: {
      borderColor: colors.secondary,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderRadius: 12,
      marginTop: "auto",
      marginHorizontal: -16,
    },
    next: {
      height: 44,
      justifyContent: "center",
      marginTop: 24,
      marginBottom: 34,
      marginHorizontal: 16,
    },
    gameTypes: {
      flexDirection: "row",
      flexWrap: "wrap",
      flexGrow: 1,
      marginBottom: 16,
    },
    gameType: {
      padding: 16,
      backgroundColor: colors.secondary,
      borderRadius: 12,
      marginRight: 16,
      marginBottom: 16,
    },
    searchView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      marginBottom: 24,
      height: 40,
    },
    searchBarView: {
      flexGrow: 1,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.secondary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginRight: 12,
      paddingRight: 16,
    },
    searchBar: {
      color: colors.tertiary,
      fontFamily: "Poppins-Regular",
      fontSize: 12,
      height: 40,
      flexGrow: 1,
      paddingHorizontal: 16,
    },
    placeholder: {
      height: 50,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      textAlign: "center",
    },
  });
