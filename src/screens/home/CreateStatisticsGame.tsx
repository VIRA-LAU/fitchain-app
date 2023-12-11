import { StackScreenProps } from "@react-navigation/stack";
import { Dispatch, SetStateAction, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { AppHeader } from "src/components";
import { StackParamList } from "src/navigation";
import { CourtType, GameType } from "src/enum-types";

type Props = StackScreenProps<StackParamList, "CreateStatisticsGame">;

const CourtTypeCard = ({
  courtType,
  selectedCourtType,
  setCourtType,
}: {
  courtType: CourtType;
  selectedCourtType: CourtType;
  setCourtType: Dispatch<SetStateAction<CourtType>>;
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
        {courtType === CourtType.FullCourt && "Full Court"}
        {courtType === "HalfCourt" && "Half Court"}
      </Text>
    </TouchableOpacity>
  );
};

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
const numOfStages = 3;
enum Stages {
  GameType = 0,
  CourtType = 1,
  Time = 2,
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

const times = [
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
];
const today = new Date();
const todayHours = today.getHours();
const todayMins = today.getMinutes();
const filteredTimes = times.filter((time) => {
  const hours = parseInt(time.substring(0, time.indexOf(":")));
  const mins = parseInt(time.substring(time.indexOf(":") + 1));

  if (todayHours > hours) return false;
  if (todayHours < hours) return true;
  if (todayHours === hours) {
    if (todayMins >= mins) return false;
    else return true;
  }
});

export const CreateStatisticsGame = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { width: windowWidth } = useWindowDimensions();

  const { data, branchId, courtTypes } = route.params;
  const stage = data?.stage ?? 0;

  const [gameType, setGameType] = useState<GameType>(
    data?.gameType ?? GameType.Basketball
  );
  const [courtType, setCourtType] = useState<CourtType>(
    data?.courtType ?? CourtType.HalfCourt
  );
  const [searchDate, setSearchDate] = useState<Date>(
    data?.searchDate ? new Date(data.searchDate) : today
  );
  const [selectedStartTime, setSelectedStartTime] = useState<string>(
    data?.selectedStartTime ?? filteredTimes.length > 0
      ? filteredTimes[0]
      : "00:00"
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(
    data?.selectedDuration ?? 0.5
  );

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

  return (
    <AppHeader absolutePosition={false} title={"Create a Game"} backEnabled>
      <View style={styles.stageBarBack}>
        <View
          style={[
            styles.stageBar,
            { width: (windowWidth / numOfStages) * (stage + 1) },
          ]}
        />
      </View>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {stage <= Stages.Time && (
          <Text style={[styles.title, { marginBottom: 16 }]}>
            {stageTitles[stage]}
          </Text>
        )}
        {stage === Stages.GameType && (
          <View style={styles.gameTypes}>
            {(!courtTypes || courtTypes.includes(GameType.Basketball)) && (
              <GameTypeCard
                gameType={GameType.Basketball}
                selectedGameType={gameType}
                setGameType={setGameType}
              />
            )}
            {(!courtTypes || courtTypes.includes(GameType.Football)) && (
              <GameTypeCard
                gameType={GameType.Football}
                selectedGameType={gameType}
                setGameType={setGameType}
              />
            )}
            {(!courtTypes || courtTypes.includes(GameType.Tennis)) && (
              <GameTypeCard
                gameType={GameType.Tennis}
                selectedGameType={gameType}
                setGameType={setGameType}
              />
            )}
          </View>
        )}
        {stage === Stages.CourtType && (
          <View style={styles.gameTypes}>
            <CourtTypeCard
              courtType={CourtType.HalfCourt}
              selectedCourtType={courtType}
              setCourtType={setCourtType}
            />
            <CourtTypeCard
              courtType={CourtType.FullCourt}
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
                minDate={today}
                todayTextStyle={{ color: colors.tertiary }}
                todayBackgroundColor={colors.secondary}
                selectedDayStyle={{ backgroundColor: colors.primary }}
                selectedDayTextColor={colors.background}
                initialDate={searchDate ?? today}
                onDateChange={(date) => {
                  const parsedDate = date.toDate();
                  setSearchDate(parsedDate);
                }}
                selectedStartDate={searchDate ?? today}
              />
            </View>
            <Text style={[styles.title, { marginTop: 24, marginBottom: 16 }]}>
              Start Time
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(searchDate.toDateString() === today.toDateString()
                ? filteredTimes
                : times
              ).map((time, index) => (
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

        <View style={styles.nextView}>
          <Button
            mode="contained"
            style={styles.next}
            onPress={() => {
              if (stage < Stages.Time)
                navigation.push("CreateStatisticsGame", {
                  data: {
                    stage: stage + 1,
                    gameType,
                    courtType,
                    searchDate: searchDate.toISOString(),
                    selectedStartTime,
                    selectedDuration,
                  },
                  branchId,
                });
              else {
              }
              // navigation.push("BookingPayment", {
              //   venueName: selectedBranch.venue.name,
              //   courtId: selectedCourt.id,
              //   courtName: gameType,
              //   courtType: gameType,
              //   courtRating: selectedCourt.rating,
              //   price: selectedCourt.price,
              //   branchLatLng: [
              //     selectedBranch.latitude,
              //     selectedBranch.longitude,
              //   ],
              //   date: searchDate.toISOString(),
              //   startTime: searchStartTime.toISOString(),
              //   endTime: searchEndTime.toISOString(),
              //   profilePhotoUrl: selectedBranch.profilePhotoUrl,
              // });
            }}
          >
            {stage < Stages.Time ? "Next" : "Complete"}
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
  });
