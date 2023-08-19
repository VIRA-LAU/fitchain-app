import React, { useState } from "react";
import { Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme, Text } from "react-native-paper";
import FeatherIcon from "react-native-vector-icons/Feather";
import { modalStyles } from "./SelectionModal";

export const GameTimeDropdown = ({
  index,
  setIndex,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { colors } = useTheme();
  const mStyles = modalStyles(colors);

  const durations = ["Upcoming Games", "Previous Games"];
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.dropDownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.title}>{durations[index]}</Text>
        <FeatherIcon
          name={`chevron-${modalVisible ? "up" : "down"}`}
          color={"white"}
          size={24}
          style={{ marginLeft: 5 }}
        />
      </TouchableOpacity>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          style={mStyles.transparentView}
          onPress={() => {
            setModalVisible(false);
          }}
        />
        <View
          style={[
            mStyles.modalView,
            {
              width: 250,
              marginLeft: "auto",
              marginRight: "auto",
            },
          ]}
        >
          {durations.map((duration, localIndex) => {
            return (
              <TouchableOpacity
                key={localIndex}
                onPress={() => {
                  setIndex(localIndex);
                  setModalVisible(false);
                }}
              >
                <View style={styles.selectionRow}>
                  <Text
                    variant="labelLarge"
                    style={{
                      color: "white",
                    }}
                  >
                    {duration}
                  </Text>
                  {index === localIndex && (
                    <FeatherIcon
                      name="check"
                      color={"white"}
                      size={26}
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropDownButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontFamily: "Inter-SemiBold",
  },
  selectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    height: 30,
  },
});
