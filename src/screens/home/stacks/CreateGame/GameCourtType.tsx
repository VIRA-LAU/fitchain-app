import { StackNavigationProp } from "@react-navigation/stack";
import { Dispatch, SetStateAction, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TouchableRipple, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "src/navigation";
import { GameType } from "src/enum-types";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { GameCreationType } from "./CreateGame";

const gameTypes = [GameType.Basketball, GameType.Football, GameType.Tennis];
const courtTypes: ("Half Court" | "Full Court")[] = [
  "Half Court",
  "Full Court",
];
const courtPrivacies: ("Private" | "Public")[] = ["Private", "Public"];

export const GameCourtType = ({
  gameDetails,
  setGameDetails,
}: {
  gameDetails: GameCreationType;
  setGameDetails: Dispatch<SetStateAction<GameCreationType>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const {
    gameType: selectedGameType,
    courtType: selectedCourtType,
    courtPrivacy: selectedCourtPrivacy,
    minNumberOfPlayers,
    maxNumberOfPlayers,
  } = gameDetails;

  return (
    <View style={{ flexGrow: 1, gap: 16 }}>
      <Text style={styles.title}>Type of Sport</Text>
      <View style={styles.gameTypes}>
        {gameTypes.map((gameType, index) => (
          <TouchableRipple
            borderless
            key={index}
            style={[
              styles.gameType,
              {
                backgroundColor:
                  selectedGameType === gameType
                    ? colors.primary
                    : colors.secondary,
              },
            ]}
            onPress={() => setGameDetails({ ...gameDetails, gameType })}
          >
            <Text
              style={[
                styles.title,
                {
                  color:
                    selectedGameType === gameType
                      ? colors.background
                      : colors.tertiary,
                },
              ]}
            >
              {gameType}
            </Text>
          </TouchableRipple>
        ))}
      </View>

      <Text style={[styles.title, { marginTop: 16 }]}>Type of Court</Text>
      <View style={styles.gameTypes}>
        {courtTypes.map((courtType, index) => (
          <TouchableRipple
            borderless
            key={index}
            style={[
              styles.gameType,
              {
                backgroundColor:
                  selectedCourtType === courtType
                    ? colors.primary
                    : colors.secondary,
              },
            ]}
            onPress={() => setGameDetails({ ...gameDetails, courtType })}
          >
            <Text
              style={[
                styles.title,
                {
                  color:
                    selectedCourtType === courtType
                      ? colors.background
                      : colors.tertiary,
                },
              ]}
            >
              {courtType}
            </Text>
          </TouchableRipple>
        ))}
      </View>

      <View style={styles.gameTypes}>
        {courtPrivacies.map((courtPrivacy, index) => (
          <TouchableRipple
            borderless
            key={index}
            style={[
              styles.gameType,
              {
                flex: 1,
                marginBottom: 0,
                alignItems: "center",
                backgroundColor:
                  selectedCourtPrivacy === courtPrivacy
                    ? colors.primary
                    : colors.secondary,
              },
            ]}
            onPress={() => setGameDetails({ ...gameDetails, courtPrivacy })}
          >
            <Text
              style={[
                styles.title,
                {
                  color:
                    selectedCourtPrivacy === courtPrivacy
                      ? colors.background
                      : colors.tertiary,
                },
              ]}
            >
              {courtPrivacy}
            </Text>
          </TouchableRipple>
        ))}
      </View>

      <Text style={[styles.title, { marginTop: 16 }]}>Number of players</Text>
      <View
        style={{
          borderRadius: 12,
          backgroundColor: colors.secondary,
          paddingVertical: 24,
          paddingHorizontal: 24,
          gap: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.text}>Minimum</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                if (minNumberOfPlayers > 0)
                  setGameDetails({
                    ...gameDetails,
                    minNumberOfPlayers: minNumberOfPlayers - 1,
                  });
              }}
            >
              <FeatherIcon
                name="minus-circle"
                color={colors.primary}
                size={24}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.title,
                {
                  fontSize: 24,
                  width: 40,
                  textAlign: "center",
                  lineHeight: 24,
                  paddingTop: 10,
                },
              ]}
            >
              {minNumberOfPlayers === 0 ? "-" : minNumberOfPlayers}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (minNumberOfPlayers < 12)
                  setGameDetails({
                    ...gameDetails,
                    minNumberOfPlayers: minNumberOfPlayers + 1,
                  });
              }}
            >
              <FeatherIcon
                name="plus-circle"
                color={colors.primary}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.text}>Maximum</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                if (maxNumberOfPlayers > 2)
                  setGameDetails({
                    ...gameDetails,
                    maxNumberOfPlayers: maxNumberOfPlayers - 1,
                  });
              }}
            >
              <FeatherIcon
                name="minus-circle"
                color={colors.primary}
                size={24}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.title,
                {
                  fontSize: 24,
                  width: 40,
                  textAlign: "center",
                  lineHeight: 24,
                  paddingTop: 10,
                },
              ]}
            >
              {maxNumberOfPlayers}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (maxNumberOfPlayers < 12)
                  setGameDetails({
                    ...gameDetails,
                    maxNumberOfPlayers: maxNumberOfPlayers + 1,
                  });
              }}
            >
              <FeatherIcon
                name="plus-circle"
                color={colors.primary}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    title: {
      fontFamily: "Poppins-Bold",
    },
    text: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
    gameTypes: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    gameType: {
      padding: 16,
      borderRadius: 12,
    },
  });
