import React, { Dispatch, SetStateAction, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { DatePickerModal, DatePickerInput } from "react-native-paper-dates";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export const DateTimePickerView = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [dateVisible, setDateVisible] = useState(false);
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
        <Pressable
          onPress={() => {
            setDateVisible(true);
          }}
        >
          <Text>Show date</Text>
        </Pressable>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={dateVisible}
          onConfirm={() => {
            setDateVisible(false);
          }}
          onDismiss={() => {
            setDateVisible(false);
          }}
        />
        {/* <DatePickerInput inputMode="start" locale="en" onChange={() => {}} value={new Date()}></DatePickerInput> */}
      </View>
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
      height: "60%",
      width: "100%",
      backgroundColor: colors.background,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 20,
    },
  });
