import React, { useState } from "react";
import { Modal, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useTheme, Text } from "react-native-paper";
import FeatherIcon from "react-native-vector-icons/Feather";
import { GameType } from "src/enum-types";
import { modalStyles } from "./SelectionModal";

export type SportSelection = {
  Basketball: boolean;
  Football: boolean;
  Tennis: boolean;
};

type SportOption = {
  type: GameType;
  image: JSX.Element;
};

const SportIcons = ({
  sports,
  selectedSports,
}: {
  sports: SportOption[];
  selectedSports: SportSelection;
}) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {sports
        .filter((sport) => selectedSports[sport.type])
        .map((sport) => sport.image)}
    </View>
  );
};

export const SportTypeDropdown = ({
  selectedSports,
  setSelectedSports,
  position = "left",
}: {
  selectedSports: SportSelection;
  setSelectedSports: React.Dispatch<React.SetStateAction<SportSelection>>;
  position?: "right" | "left";
}) => {
  const { colors } = useTheme();
  const mStyles = modalStyles(colors);

  const sports = (absolute = false): SportOption[] => [
    {
      type: GameType.Basketball,
      image: (
        <Image
          key={GameType.Basketball}
          source={require("assets/images/home/basketball.png")}
          style={[styles.gameIcon, absolute ? { marginRight: -27.5 } : null]}
        />
      ),
    },
    {
      type: GameType.Football,
      image: (
        <Image
          key={GameType.Football}
          source={require("assets/images/home/football.png")}
          style={[styles.gameIcon, absolute ? { marginRight: -27.5 } : null]}
        />
      ),
    },
    {
      type: GameType.Tennis,
      image: (
        <Image
          key={GameType.Tennis}
          source={require("assets/images/home/tennis.png")}
          style={[styles.gameIcon, absolute ? { marginRight: -27.5 } : null]}
        />
      ),
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);

  const updateSelectedSports = (sport: GameType) => {
    let numSelectedSports = 0;
    Object.keys(selectedSports).forEach((key) => {
      if (selectedSports[key as GameType]) numSelectedSports++;
    });
    if (numSelectedSports !== 1 || !selectedSports[sport])
      setSelectedSports({
        ...selectedSports,
        [sport]: !selectedSports[sport],
      });
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.dropDownButton}
        onPress={() => setModalVisible(true)}
      >
        <SportIcons sports={sports(true)} selectedSports={selectedSports} />
        <FeatherIcon
          name={`chevron-${modalVisible ? "up" : "down"}`}
          color={colors.tertiary}
          size={24}
          style={{ marginLeft: 32.5, width: 25 }}
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
            },
            position === "left"
              ? {
                  marginLeft: 5,
                }
              : {
                  marginLeft: "auto",
                  marginRight: 5,
                  marginTop: 80,
                },
          ]}
        >
          {sports().map((sport, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => updateSelectedSports(sport.type)}
              >
                <View style={styles.sportRowView}>
                  {sport.image}
                  <Text
                    variant="labelLarge"
                    style={{
                      color: colors.tertiary,
                    }}
                  >
                    {sport.type}
                  </Text>
                  {selectedSports[sport.type] && (
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
    </View>
  );
};

const styles = StyleSheet.create({
  dropDownButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  gameIcon: { marginRight: 10, width: 35, aspectRatio: 1 },
  sportRowView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});
