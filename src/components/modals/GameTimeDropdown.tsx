import React, { Dispatch, SetStateAction } from "react";
import { View, TouchableOpacity, Dimensions } from "react-native";
import { useTheme, Text, Modal } from "react-native-paper";
import FeatherIcon from "react-native-vector-icons/Feather";

export const GameTimeDropdown = ({
  modalVisible,
  setModalVisible,
  index,
  setIndex,
  durations,
}: {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  durations: string[];
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={modalVisible}
      style={{ marginTop: 0 }}
      contentContainerStyle={{ height: "100%", justifyContent: "flex-start" }}
      dismissableBackButton
      dismissable={false}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
        }}
        onPress={() => {
          setModalVisible(false);
        }}
      />
      <View
        style={{
          backgroundColor: colors.secondary,
          borderRadius: 20,
          paddingHorizontal: 25,
          paddingVertical: 10,
          marginHorizontal: 0.2 * Dimensions.get("screen").width,
        }}
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10,
                  height: 30,
                }}
              >
                <Text
                  variant="labelLarge"
                  style={{
                    color: colors.tertiary,
                  }}
                >
                  {duration}
                </Text>
                {index === localIndex && (
                  <FeatherIcon
                    name="check"
                    color={colors.tertiary}
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
  );
};
