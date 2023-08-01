import React, { Fragment, useState, Dispatch, SetStateAction } from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Slider } from "@miblanchard/react-native-slider";
import { TimeSlot } from "src/types";

export const parseTimeFromMinutes = (
  num?: number,
  includeMinutes: boolean = true
) => {
  if (typeof num !== "undefined") {
    const suffix =
      num === 1440 ? "AM" : Math.floor(num / 60) >= 12 ? "PM" : "AM";
    var hour =
      Math.floor(num / 60) >= 12
        ? Math.floor(num / 60) - 12
        : Math.floor(num / 60);
    if (hour === 0) hour = 12;

    if (includeMinutes) {
      const minutes = num % 60;
      return `${("0" + hour).slice(-2)}:${("0" + minutes).slice(-2)} ${suffix}`;
    } else {
      return `${hour} ${suffix}`;
    }
  } else return "";
};

const trackMarks: number[] = [];
for (var i = 0; i <= 1440; i += 240) trackMarks.push(i);

export const TimeSlotPicker = ({
  visible,
  setVisible,
  time,
  onPress,
  showEndTime = false,
  availableTimes = [],
  occupiedTimes = [],
  constrained = false,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  time?: TimeSlot;
  onPress: (tempTime: TimeSlot) => void;
  showEndTime?: boolean;
  availableTimes?: TimeSlot[];
  occupiedTimes?: TimeSlot[];
  constrained?: boolean;
}) => {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, width, height);

  const [tempTime, setTempTime] = useState<number[]>(
    time ? [time.startTime, time.endTime] : [720, 840]
  );
  const diff = tempTime[1] - tempTime[0];
  const duration =
    diff === 30 ? "30 minutes" : diff === 60 ? "1 hour" : `${diff / 60} hours`;

  var tintColor =
    !constrained ||
    (!occupiedTimes.some(
      (oTime) =>
        (tempTime[0] > oTime.startTime && tempTime[0] < oTime.endTime) ||
        (tempTime[1] > oTime.startTime && tempTime[1] < oTime.endTime)
    ) &&
      !occupiedTimes.some(
        (oTime) =>
          tempTime[0] <= oTime.startTime && tempTime[1] >= oTime.endTime
      ) &&
      availableTimes.some(
        (aTime) =>
          tempTime[0] >= aTime.startTime && tempTime[1] <= aTime.endTime
      ))
      ? colors.primary
      : "transparent";

  return (
    <Fragment>
      <Pressable
        style={[styles.backgroundView, { display: visible ? "flex" : "none" }]}
        onPress={() => {
          setVisible(false);
        }}
      />
      <View
        style={[styles.wrapperView, { display: visible ? "flex" : "none" }]}
      >
        <View style={styles.summaryView}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              borderRightWidth: 1,
              borderRightColor: colors.tertiary,
            }}
          >
            <View>
              <Text style={styles.labelText}>Start Time</Text>
              <Text style={styles.valueText}>
                {parseTimeFromMinutes(tempTime[0])}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ minWidth: "60%" }}>
              <Text style={styles.labelText}>
                {showEndTime ? "End Time" : "Duration"}
              </Text>
              <Text style={styles.valueText}>
                {showEndTime ? parseTimeFromMinutes(tempTime[1]) : duration}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ position: "relative" }}>
          <Slider
            containerStyle={styles.absoluteSlider}
            disabled
            renderThumbComponent={() => <View></View>}
          />
          {availableTimes?.map((availableTime, index) => (
            <Slider
              key={index}
              containerStyle={styles.absoluteSlider}
              minimumValue={0}
              maximumValue={1440}
              value={[availableTime.startTime, availableTime.endTime]}
              minimumTrackTintColor={"green"}
              maximumTrackTintColor="transparent"
              disabled
              renderThumbComponent={() => <View></View>}
            />
          ))}
          {occupiedTimes?.map((occupiedTime, index) => (
            <Slider
              key={index}
              containerStyle={styles.absoluteSlider}
              minimumValue={0}
              maximumValue={1440}
              value={[occupiedTime.startTime, occupiedTime.endTime]}
              minimumTrackTintColor={"red"}
              maximumTrackTintColor="transparent"
              disabled
              renderThumbComponent={() => <View></View>}
            />
          ))}
          <Slider
            minimumValue={0}
            maximumValue={1440}
            step={30}
            value={tempTime}
            trackMarks={trackMarks}
            onValueChange={setTempTime}
            thumbTintColor={colors.primary}
            minimumTrackTintColor={tintColor}
            maximumTrackTintColor="transparent"
            renderTrackMarkComponent={(index) => {
              return (
                <View
                  style={{ marginTop: 50, transform: [{ translateX: -10 }] }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Medium",
                      color: colors.tertiary,
                    }}
                  >
                    {parseTimeFromMinutes(trackMarks[index], false)}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <Button
          mode="contained"
          style={{ marginTop: 40 }}
          buttonColor={
            tintColor === colors.primary ? colors.primary : colors.tertiary
          }
          onPress={
            tintColor === colors.primary
              ? () => {
                  onPress({
                    startTime: tempTime[0],
                    endTime: tempTime[1],
                  });
                }
              : undefined
          }
        >
          Confirm
        </Button>
      </View>
    </Fragment>
  );
};

const makeStyles = (colors: MD3Colors, width: number, height: number) =>
  StyleSheet.create({
    backgroundView: {
      position: "absolute",
      width,
      height,
      backgroundColor: "black",
      opacity: 0.5,
      zIndex: 2,
    },
    wrapperView: {
      position: "absolute",
      bottom: 0,
      width: width,
      backgroundColor: colors.background,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 20,
      zIndex: 2,
    },
    summaryView: {
      marginBottom: 20,
      flexDirection: "row",
      backgroundColor: colors.secondary,
      paddingVertical: 20,
      borderRadius: 7,
    },
    labelText: { fontFamily: "Inter-Medium", color: colors.tertiary },
    valueText: {
      fontFamily: "Inter-Medium",
      color: "white",
      fontSize: 22,
    },
    absoluteSlider: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    },
  });
