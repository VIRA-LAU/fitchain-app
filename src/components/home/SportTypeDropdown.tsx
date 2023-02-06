import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Pressable, View } from "react-native";
import { colors } from "react-native-elements";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { Image } from "react-native-elements/dist/image/Image";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme, Text } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";

const SportTypeDropdown = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [modalVisible, setModalVisible] = useState(false);
  const [sportType, setSportType] = useState([
    {
      type: "Football",
      image: "assets/images/home/football.png",
      icon: false,
    },
    {
      type: "Basketball",
      image: "assets/images/home/basketball.png",
      icon: false,
    },
  ]);
  const fixSportType = (index: any) => {
    const updatedSportType = sportType.map((sport, i) => {
      if (i === index) {
        return { ...sport, icon: !sport.icon };
      }
      return sport;
    });
    setSportType(updatedSportType);
  };
  return (
    <View>
      <Pressable
        style={[styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        {!modalVisible && (
          <FeatherIcon name="arrow-down" color={colors.tertiary} size={30} />
        )}
        {modalVisible && (
          <FeatherIcon name="arrow-up" color={colors.tertiary} size={30} />
        )}
      </Pressable>
      <View style={styles.centeredView}>
        <Modal
          animationType="none"
          style={{ backgroundColor: colors.background }}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                style={[styles.button]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <FeatherIcon name="x" color={colors.tertiary} size={30} />
              </Pressable>
              <View>
                {sportType.map((sport, index) => {
                  return (
                    <TouchableOpacity onPress={() => fixSportType(index)}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Text
                          variant="labelLarge"
                          style={{
                            color: "white",
                            marginBottom: 10,
                            alignSelf: "flex-start",
                          }}
                        >
                          {sport["type"]}
                        </Text>
                        {sport["icon"] && (
                          <FeatherIcon
                            name="check"
                            color={colors.tertiary}
                            size={30}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      width: 300,
      height: 200,
      marginTop: 30,
      marginLeft: 25,
      color: "white",
    },
    modalView: {
      margin: 20,
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 35,
      borderColor: "white",
      borderWidth: 0.2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      alignSelf: "flex-end",
    },
    buttonOpen: {
      marginLeft: 45,
      paddingLeft: 20,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      color: "white",
    },
  });

export default SportTypeDropdown;
