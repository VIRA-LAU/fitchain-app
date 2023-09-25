import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

export const SelectionModal = ({
  visible,
  setVisible,
  options,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  options: {
    text: string;
    onPress: () => void;
  }[];
}) => {
  const { colors } = useTheme();
  const styles = modalStyles(colors);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableOpacity
        style={styles.transparentView}
        onPress={() => {
          setVisible(false);
        }}
      />
      <View
        style={[
          styles.modalView,
          {
            width: 180,
            marginLeft: "auto",
            marginRight: 5,
          },
        ]}
      >
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.selectionRow}
            onPress={option.onPress}
          >
            <Text
              variant="labelLarge"
              style={{
                color: colors.tertiary,
              }}
            >
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

export const modalStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    transparentView: {
      position: "absolute",
      height: "100%",
      width: "100%",
    },
    modalView: {
      marginTop: 67,
      backgroundColor: colors.secondary,
      borderRadius: 20,
      paddingHorizontal: 25,
      paddingVertical: 10,
      borderColor: colors.tertiary,
      borderWidth: 1,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 10,
    },
    selectionRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 7,
      height: 40,
    },
  });
