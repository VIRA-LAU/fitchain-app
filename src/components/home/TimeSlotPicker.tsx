import React, { Dispatch, SetStateAction } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { TimeSlot } from "src/types";

export const TimeSlotPicker = ({
  visible,
  setVisible,
  onPress,
  timeSlots,
  selectedTimeSlots,
  setSelectedTimeSlots,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  onPress: Function;
  timeSlots?: { timeSlot: TimeSlot }[];
  selectedTimeSlots: TimeSlot[];
  setSelectedTimeSlots: Dispatch<SetStateAction<TimeSlot[]>>;
}) => {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const styles = makeStyles(colors, height, width);

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
        <Text style={styles.title}>Select Time Slot</Text>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {timeSlots?.map(({ timeSlot }, index) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={index}
              style={[
                styles.timeSlotView,
                index === 0
                  ? { marginLeft: 20 }
                  : index === timeSlots.length - 1
                  ? { marginRight: 20 }
                  : {},
                selectedTimeSlots.findIndex(
                  (slot) => slot.id === timeSlot.id
                ) !== -1
                  ? { borderColor: colors.primary }
                  : {},
              ]}
              onPress={() => {
                if (
                  selectedTimeSlots.findIndex(
                    (slot) => slot.id === timeSlot.id
                  ) === -1
                )
                  setSelectedTimeSlots([...selectedTimeSlots, timeSlot]);
                else
                  setSelectedTimeSlots(
                    selectedTimeSlots.filter((slot) => slot.id !== timeSlot.id)
                  );
              }}
            >
              <Text style={styles.timeSlotText}>
                {timeSlot.startTime} - {timeSlot.endTime}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Button
          buttonColor={
            selectedTimeSlots.length > 0 ? colors.primary : colors.tertiary
          }
          textColor={"black"}
          style={{ borderRadius: 5, margin: 25 }}
          onPress={
            selectedTimeSlots.length > 0
              ? () => {
                  onPress();
                  setVisible(false);
                }
              : undefined
          }
        >
          Continue
        </Button>
      </View>
    </React.Fragment>
  );
};

const makeStyles = (colors: MD3Colors, height: number, width: number) =>
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
      paddingTop: 20,
      zIndex: 2,
    },
    title: {
      fontFamily: "Inter-SemiBold",
      color: colors.tertiary,
      marginBottom: 20,
      marginHorizontal: 20,
    },
    timeSlotView: {
      backgroundColor: colors.secondary,
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginHorizontal: 3,
      borderWidth: 1,
      borderColor: colors.secondary,
    },
    timeSlotText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
    },
  });
