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
import {
  AppHeader,
  BranchCard,
  BranchCardSkeleton,
  CourtCard,
} from "src/components";
import { StackParamList } from "src/navigation";
import { Branch, Court, GameType } from "src/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useSearchBranchesQuery } from "src/api";
import Feather from "react-native-vector-icons/Feather";

type Props = StackScreenProps<StackParamList, "BookCourt">;

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

const numOfStages = 6;
enum Stages {
  GameType = 0,
  CourtType = 1,
  Time = 2,
  BranchSelection = 3,
  CourtSelection = 4,
  NumPlayers = 5,
}
const stageTitles = [
  "Type of Sport",
  "Type of Court",
  "Dates",
  "",
  "Select Court",
  "",
  "Invite Friends",
];

export const BookCourt = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { width: windowWidth } = useWindowDimensions();

  const { data, branchId, courtTypes } = route.params;
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
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(
    data?.selectedBranch
  );
  const [selectedCourt, setSelectedCourt] = useState<Court | undefined>(
    data?.selectedCourt
  );
  const [courtPrivacy, setCourtPrivacy] = useState<"Private" | "Public">(
    "Private"
  );
  const [minNumberOfPlayers, setMinNumberOfPlayers] = useState<number>(0);
  const [maxNumberOfPlayers, setMaxNumberOfPlayers] = useState<number>(8);

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
    branchId,
  });

  var branchPrices: string[] = [];

  if (branches)
    branchPrices = branches.map((branch) =>
      branch.courts.length === 1
        ? branch.courts[0].price.toString()
        : `${Math.min.apply(
            null,
            branch.courts.map((court) => court.price)
          )}-${Math.max.apply(
            null,
            branch.courts.map((court) => court.price)
          )}`
    );

  const buttonDisabled =
    (stage === Stages.BranchSelection && !selectedBranch) ||
    (stage === Stages.CourtSelection && !selectedCourt);

  useEffect(() => {
    if (stage === Stages.BranchSelection) fetchBranches();
  }, []);

  useEffect(() => {
    if (stage === Stages.BranchSelection && branches && branchId) {
      const selBranch = branches.find((branch) => branch.id === branchId);
      if (selBranch)
        navigation.replace("BookCourt", {
          data: {
            stage: stage + (selBranch.courts.length > 1 ? 1 : 2),
            gameType,
            courtType,
            searchDate: searchDate.toISOString(),
            selectedStartTime,
            selectedDuration,
            branchSearchText,
            selectedBranch: selBranch,
            selectedCourt:
              selBranch.courts.length > 1 ? undefined : selBranch.courts[0],
          },
          branchId,
        });
    }
  }, [JSON.stringify(branches)]);

  return (
    <AppHeader absolutePosition={false} title={"Book a Court"} backEnabled>
      <View style={styles.stageBarBack}>
        <View
          style={[
            styles.stageBar,
            { width: (windowWidth / numOfStages) * (stage + 1) },
          ]}
        />
      </View>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {(stage <= Stages.Time || stage === Stages.CourtSelection) && (
          <Text style={[styles.title, { marginBottom: 16 }]}>
            {stageTitles[stage]}
          </Text>
        )}
        {stage === Stages.GameType && (
          <View style={styles.gameTypes}>
            {(!courtTypes || courtTypes.includes("Basketball")) && (
              <GameTypeCard
                gameType="Basketball"
                selectedGameType={gameType}
                setGameType={setGameType}
              />
            )}
            {(!courtTypes || courtTypes.includes("Football")) && (
              <GameTypeCard
                gameType="Football"
                selectedGameType={gameType}
                setGameType={setGameType}
              />
            )}
            {(!courtTypes || courtTypes.includes("Tennis")) && (
              <GameTypeCard
                gameType="Tennis"
                selectedGameType={gameType}
                setGameType={setGameType}
              />
            )}
          </View>
        )}
        {stage === Stages.CourtType && (
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
        {stage === Stages.Time && (
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                backgroundColor: colors.secondary,
                marginHorizontal: -16,
                paddingVertical: 16,
                borderBottomLeftRadius: 28,
                borderBottomRightRadius: 28,
              }}
            >
              <CalendarPicker
                width={windowWidth - 64}
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
            </View>
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
        {stage === Stages.BranchSelection && (
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
                      price={branchPrices[index]}
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
        {stage === Stages.CourtSelection && (
          <View style={{ marginBottom: 16 }}>
            {selectedBranch?.courts.map((court, index) => (
              <CourtCard
                key={index}
                name={court.name}
                price={court.price}
                rating={court.rating}
                type={court.courtType}
                venueName={selectedBranch.venue.name}
                isSelected={selectedCourt?.id === court.id}
                onPress={() => {
                  setSelectedCourt(court);
                }}
              />
            ))}
          </View>
        )}
        {stage === Stages.NumPlayers && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.gameType,
                  { flex: 1, marginBottom: 0, alignItems: "center" },
                  courtPrivacy === "Private"
                    ? {
                        backgroundColor: colors.primary,
                      }
                    : {},
                ]}
                onPress={() => setCourtPrivacy("Private")}
              >
                <Text
                  style={[
                    styles.title,
                    courtPrivacy === "Private"
                      ? {
                          color: colors.background,
                        }
                      : {},
                  ]}
                >
                  Private
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.gameType,
                  {
                    flex: 1,
                    marginBottom: 0,
                    marginRight: 0,
                    alignItems: "center",
                  },
                  courtPrivacy === "Public"
                    ? {
                        backgroundColor: colors.primary,
                      }
                    : {},
                ]}
                onPress={() => setCourtPrivacy("Public")}
              >
                <Text
                  style={[
                    styles.title,
                    courtPrivacy === "Public"
                      ? {
                          color: colors.background,
                        }
                      : {},
                  ]}
                >
                  Public
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.title, { marginBottom: 16 }]}>
              Number of players
            </Text>
            <View
              style={{
                borderRadius: 12,
                backgroundColor: colors.secondary,
                paddingVertical: 25,
                paddingHorizontal: 22,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text style={styles.text}>Minimum</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (minNumberOfPlayers > 0)
                        setMinNumberOfPlayers((oldNum) => oldNum - 1);
                    }}
                  >
                    <Feather
                      name="minus-circle"
                      color={colors.primary}
                      size={24}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontSize: 24,
                        width: 40,
                        textAlign: "center",
                        lineHeight: 24,
                        paddingTop: 10,
                      },
                    ]}
                  >
                    {minNumberOfPlayers === 0 ? "-" : minNumberOfPlayers}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (minNumberOfPlayers < 12)
                        setMinNumberOfPlayers((oldNum) => oldNum + 1);
                    }}
                  >
                    <Feather
                      name="plus-circle"
                      color={colors.primary}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.text}>Maximum</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (maxNumberOfPlayers > 2)
                        setMaxNumberOfPlayers((oldNum) => oldNum - 1);
                    }}
                  >
                    <Feather
                      name="minus-circle"
                      color={colors.primary}
                      size={24}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontSize: 24,
                        width: 40,
                        textAlign: "center",
                        lineHeight: 24,
                        paddingTop: 10,
                      },
                    ]}
                  >
                    {maxNumberOfPlayers}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (maxNumberOfPlayers < 12)
                        setMaxNumberOfPlayers((oldNum) => oldNum + 1);
                    }}
                  >
                    <Feather
                      name="plus-circle"
                      color={colors.primary}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        <View style={styles.nextView}>
          <Button
            mode="contained"
            style={[
              styles.next,
              {
                backgroundColor: buttonDisabled
                  ? colors.secondary
                  : colors.primary,
              },
            ]}
            onPress={
              buttonDisabled
                ? undefined
                : () => {
                    if (
                      stage <= Stages.Time ||
                      (stage == Stages.CourtSelection && selectedCourt)
                    )
                      navigation.push("BookCourt", {
                        data: {
                          stage:
                            stage +
                            (stage === Stages.Time && selectedBranch ? 2 : 1),
                          gameType,
                          courtType,
                          searchDate: searchDate.toISOString(),
                          selectedStartTime,
                          selectedDuration,
                          branchSearchText,
                          selectedBranch,
                          selectedCourt,
                        },
                        branchId,
                      });
                    else if (
                      stage == Stages.BranchSelection &&
                      selectedBranch
                    ) {
                      navigation.push("BookCourt", {
                        data: {
                          stage:
                            stage + (selectedBranch.courts.length > 1 ? 1 : 2),
                          gameType,
                          courtType,
                          searchDate: searchDate.toISOString(),
                          selectedStartTime,
                          selectedDuration,
                          branchSearchText,
                          selectedBranch,
                          selectedCourt:
                            selectedBranch.courts.length > 1
                              ? undefined
                              : selectedBranch.courts[0],
                        },
                        branchId,
                      });
                    } else if (
                      stage == Stages.NumPlayers &&
                      selectedBranch &&
                      selectedCourt
                    )
                      navigation.push("BookingPayment", {
                        venueName: selectedBranch.venue.name,
                        courtId: selectedCourt.id,
                        courtName: gameType,
                        courtType: gameType,
                        courtRating: selectedCourt.rating,
                        price: selectedCourt.price,
                        branchLatLng: [
                          selectedBranch.latitude,
                          selectedBranch.longitude,
                        ],
                        date: searchDate.toISOString(),
                        startTime: searchStartTime.toISOString(),
                        endTime: searchEndTime.toISOString(),
                        profilePhotoUrl: selectedBranch.profilePhotoUrl,
                      });
                  }
            }
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
