import { Dispatch, SetStateAction, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { GameCreationType } from "./CreateGame";
import CalendarPicker from "react-native-calendar-picker";
import { Slider } from "@miblanchard/react-native-slider";
import { parseTimeFromMinutes } from "src/components";

export const times = [
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

const trackMarks: number[] = [];
for (var i = 0; i <= 1440; i += 240) trackMarks.push(i);

export const DateTime = ({
  gameDetails,
  setGameDetails,
  isBooking,
}: {
  gameDetails: GameCreationType;
  setGameDetails: Dispatch<SetStateAction<GameCreationType>>;
  isBooking?: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const {
    startTime: selectedStartTime,
    duration: selectedDuration,
    searchDate: searchDateStr,
  } = gameDetails;

  const searchDate = new Date(searchDateStr);

  const [tempTime, setTempTime] = useState<number[]>([720, 840]);

  return (
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
          width={Dimensions.get("screen").width - 64}
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
            setGameDetails({
              ...gameDetails,
              searchDate: parsedDate.toISOString(),
            });
          }}
          selectedStartDate={searchDate ?? today}
        />
      </View>

      {isBooking && (
        <View>
          <Text style={[styles.title, { marginTop: 24, marginBottom: 16 }]}>
            Start Time
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -16 }}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
          >
            {(searchDate.toDateString() === today.toDateString()
              ? filteredTimes
              : times
            ).map((time, index) => (
              <TouchableRipple
                key={index}
                borderless
                style={[
                  styles.gameType,
                  {
                    backgroundColor:
                      time === selectedStartTime
                        ? colors.primary
                        : colors.secondary,
                  },
                ]}
                onPress={() =>
                  setGameDetails({
                    ...gameDetails,
                    startTime: time,
                  })
                }
              >
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        time === selectedStartTime
                          ? colors.background
                          : colors.tertiary,
                    },
                  ]}
                >
                  {time}
                </Text>
              </TouchableRipple>
            ))}
          </ScrollView>
          <Text style={[styles.title, { marginTop: 24, marginBottom: 16 }]}>
            Duration
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -16 }}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
          >
            {[0.5, 1, 1.5, 2].map((duration, index) => (
              <TouchableRipple
                key={index}
                borderless
                style={[
                  styles.gameType,
                  {
                    backgroundColor:
                      duration === selectedDuration
                        ? colors.primary
                        : colors.secondary,
                  },
                ]}
                onPress={() =>
                  setGameDetails({
                    ...gameDetails,
                    duration,
                  })
                }
              >
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        duration === selectedDuration
                          ? colors.background
                          : colors.tertiary,
                    },
                  ]}
                >
                  {duration === 0.5
                    ? "30 mins"
                    : duration === 1
                    ? "1 hour"
                    : `${duration} hours`}
                </Text>
              </TouchableRipple>
            ))}
          </ScrollView>
        </View>
      )}

      {!isBooking && (
        <View>
          <Text style={[styles.title, { marginTop: 24, marginBottom: 16 }]}>
            Duration
          </Text>
          <View style={{ position: "relative", marginTop: 32 }}>
            <Slider
              containerStyle={styles.absoluteSlider}
              disabled
              renderThumbComponent={() => <View></View>}
            />

            <Slider
              minimumValue={0}
              maximumValue={1440}
              step={30}
              value={tempTime}
              trackMarks={trackMarks}
              onValueChange={setTempTime}
              thumbTintColor={colors.primary}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor="transparent"
              renderTrackMarkComponent={(index) => {
                return (
                  <View
                    style={{ marginTop: 50, transform: [{ translateX: -10 }] }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        color: colors.tertiary,
                      }}
                    >
                      {parseTimeFromMinutes(trackMarks[index], false)}
                    </Text>
                  </View>
                );
              }}
              renderAboveThumbComponent={(value, index) => (
                <View
                  style={{
                    transform: [
                      { translateX: -24 },
                      {
                        translateY:
                          value === 1 && tempTime[1] - tempTime[0] < 300
                            ? -20
                            : 0,
                      },
                    ],
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      color: colors.tertiary,
                    }}
                  >
                    {parseTimeFromMinutes(index, true)}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    title: {
      fontFamily: "Poppins-Bold",
    },
    gameType: {
      padding: 16,
      backgroundColor: colors.secondary,
      borderRadius: 12,
      minWidth: 112,
      alignItems: "center",
    },
    placeholder: {
      height: 50,
      justifyContent: "center",
    },
    absoluteSlider: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    },
  });
