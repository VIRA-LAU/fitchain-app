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

export const SportTypeDropdown = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const sports = [
    {
      type: "Football",
      image: (
        <Image
          source={require("assets/images/home/football.png")}
          style={styles.gameIcon}
        />
      ),
    },
    {
      type: "Basketball",
      image: (
        <Image
          source={require("assets/images/home/basketball.png")}
          style={styles.gameIcon}
        />
      ),
    },
    {
      type: "Tennis",
      image: (
        <Image
          source={require("assets/images/home/tennis.png")}
          style={styles.gameIcon}
        />
      ),
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSports, setSelectedSports] = useState([false, false, false]);

  const updateSelectedSports = (index: number) => {
    setSelectedSports((oldSelectedSports) => {
      const updatedSelectedSports = oldSelectedSports.map(
        (selectedSport, i) => {
          if (i === index) {
            return !selectedSport;
          }
          return selectedSport;
        }
      );
      return updatedSelectedSports;
    });
  };

  return (
    <View style={{ justifyContent: "center" }}>
      <Pressable
        style={styles.dropDownButton}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={require("assets/images/home/basketball.png")}
          style={styles.gameIcon}
        />
        <FeatherIcon
          name={`chevron-${modalVisible ? "up" : "down"}`}
          color={"white"}
          size={24}
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
          {sports.map((sport, index) => {
            return (
              <Pressable
                key={index}
                onPress={() => updateSelectedSports(index)}
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
                  {selectedSports[index] && (
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
      shadowColor: "#000",
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

export default SportTypeDropdown;
