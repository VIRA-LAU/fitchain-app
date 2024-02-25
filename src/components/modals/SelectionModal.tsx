import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Modal, Text, useTheme } from "react-native-paper";
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
    <Modal
      style={{ marginTop: 0 }}
      contentContainerStyle={{
        height: "100%",
        justifyContent: "flex-start",
        alignItems: "flex-end",
      }}
      visible={visible}
      dismissableBackButton
      onDismiss={() => setVisible(false)}
    >
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
      backgroundColor: "#0005",
    },
    modalView: {
      backgroundColor: colors.secondary,
      borderRadius: 10,
      paddingHorizontal: 25,
      paddingVertical: 10,
      marginTop: 95,
    },
    selectionRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 7,
      height: 40,
    },
  });
