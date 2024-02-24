import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { PopupContainer } from "./PopupContainer";

export const CreateGameChoicePopup = ({
  visible,
  setVisible,
  bookCourt,
  skipBooking,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  bookCourt: Function;
  skipBooking: Function;
}) => {
  const { colors } = useTheme();

  return (
    <PopupContainer
      title="Would you like to book your court through FitChain or just create a game?"
      visible={visible}
      setVisible={setVisible}
    >
      <View style={{ gap: 16 }}>
        <Button mode="contained" onPress={() => bookCourt()}>
          Book Court
        </Button>
        <Button onPress={() => skipBooking()}>Create Game</Button>
      </View>
    </PopupContainer>
  );
};
