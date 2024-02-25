import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { ModalContainer } from "./ModalContainer";

export const CreateGameChoiceModal = ({
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
    <ModalContainer
      title="Would you like to book your court through FitChain or just create a game?"
      visible={visible}
      setVisible={setVisible}
    >
      <View style={{ gap: 16 }}>
        <Button
          mode="contained"
          onPress={() => {
            setVisible(false);
            bookCourt();
          }}
        >
          Book Court
        </Button>
        <Button
          onPress={() => {
            setVisible(false);
            skipBooking();
          }}
        >
          Create Game
        </Button>
      </View>
    </ModalContainer>
  );
};
