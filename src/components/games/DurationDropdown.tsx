import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";

export const DurationDropdown = ({
  index,
  setIndex,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const durations = ["Upcoming Games", "Previous Games"];
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
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
          style={styles.transparentView}
          onPress={() => {
            setModalVisible(false);
          }}
        />
        <View style={styles.modalView}>
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

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    dropDownButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      color: "white",
      fontFamily: "Inter-SemiBold",
    },
    transparentView: {
      position: "absolute",
      height: "100%",
      width: "100%",
    },
    modalView: {
      width: 250,
      marginTop: 75,
      marginLeft: "auto",
      marginRight: "auto",
      backgroundColor: colors.secondary,
      borderRadius: 20,
      paddingHorizontal: 30,
      paddingVertical: 15,
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
      marginVertical: 10,
      height: 30,
    },
  });
