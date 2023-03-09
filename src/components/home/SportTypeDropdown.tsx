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
import { GameType } from "src/types";

export type SportSelection = {
  Basketball: boolean;
  Football: boolean;
  Tennis: boolean;
};

type SportOption = {
  type: "Basketball" | "Football" | "Tennis";
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
        .filter(
          (sport, index) =>
            selectedSports[Object.keys(selectedSports)[index] as GameType]
        )
        .map((sport) => sport.image)}
    </View>
  );
};

export const SportTypeDropdown = ({
  selectedSports,
  setSelectedSports,
}: {
  selectedSports: SportSelection;
  setSelectedSports: React.Dispatch<React.SetStateAction<SportSelection>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const sports = (absolute = false): SportOption[] => [
    {
      type: "Basketball",
      image: (
        <Image
          key="basketball"
          source={require("assets/images/home/basketball.png")}
          style={[styles.gameIcon, absolute ? { marginRight: -27.5 } : null]}
        />
      ),
    },
    {
      type: "Football",
      image: (
        <Image
          key="football"
          source={require("assets/images/home/football.png")}
          style={[styles.gameIcon, absolute ? { marginRight: -27.5 } : null]}
        />
      ),
    },
    {
      type: "Tennis",
      image: (
        <Image
          key="tennis"
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
      setSelectedSports((oldSelectedSports) => {
        const updatedSelectedSports = {
          ...oldSelectedSports,
          [sport]: !selectedSports[sport],
        };
        return updatedSelectedSports;
      });
  };

  return (
    <View>
      <Pressable
        style={styles.dropDownButton}
        onPress={() => setModalVisible(true)}
      >
        <SportIcons sports={sports(true)} selectedSports={selectedSports} />
        <FeatherIcon
          name={`chevron-${modalVisible ? "up" : "down"}`}
          color={"white"}
          size={24}
          style={{ marginLeft: 32.5, width: 25 }}
        />
      </Pressable>
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          style={styles.transparentView}
          onPress={() => {
            setModalVisible(false);
          }}
        />
        <View style={styles.modalView}>
          {sports().map((sport, index) => {
            return (
              <Pressable
                key={index}
                onPress={() => updateSelectedSports(sport.type)}
              >
                <View style={styles.sportRowView}>
                  {sport.image}
                  <Text
                    variant="labelLarge"
                    style={{
                      color: "white",
                    }}
                  >
                    {sport.type}
                  </Text>
                  {selectedSports[sport.type] && (
                    <FeatherIcon
                      name="check"
                      color={"white"}
                      size={26}
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </View>
              </Pressable>
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
    gameIcon: { marginRight: 10, width: 35, aspectRatio: 1 },
    transparentView: {
      position: "absolute",
      height: "100%",
      width: "100%",
    },
    modalView: {
      width: 250,
      marginTop: 70,
      marginLeft: 15,
      backgroundColor: colors.secondary,
      borderRadius: 20,
      paddingHorizontal: 20,
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
    sportRowView: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
    },
  });
