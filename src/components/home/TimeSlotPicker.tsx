import React, { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Button, useTheme } from "react-native-paper";
import { DatePickerModal, DatePickerInput } from "react-native-paper-dates";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export const TimeSlotPicker = ({
  visible,
  setVisible,
  onPress,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  onPress: Function;
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
        <ScrollView horizontal>
          <View style={styles.timeSlotView}>
            <Text style={styles.timeSlotText}>11:00 - 12:00</Text>
          </View>
        </ScrollView>
        <Button
          buttonColor={colors.primary}
          textColor={"black"}
          style={{ borderRadius: 5, margin: 25 }}
          onPress={() => {
            onPress();
            setVisible(false);
          }}
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
    },
    timeSlotText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
    },
  });
