import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput,
} from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { GameType } from "src/types";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useCreateCourtMutation, useTimeSlotsQuery } from "src/api";

export const CreateCourt = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [courtType, setCourtType] = useState<GameType>("Basketball");
  const [numOfPlayers, setNumOfPlayers] = useState<number>(6);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>([]);

  const completeCreate = () => {
    setName("");
    setPrice("");
    setSelectedTimeSlots([]);
    setVisible(false);
  };

  const { data: timeSlots } = useTimeSlotsQuery();
  const { mutate: createCourt, isLoading } =
    useCreateCourtMutation(completeCreate);

  const priceRef: React.MutableRefObject<TextInput | null> = useRef(null);

  return (
    <React.Fragment>
      <Pressable
        style={[styles.backgroundView, { display: visible ? "flex" : "none" }]}
        onPress={() => {
          setVisible(false);
        }}
      />
      <View
        style={[styles.wrapperView, { display: visible ? "flex" : "none" }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create a Court</Text>
          <TouchableOpacity
            style={{ position: "absolute", right: 0 }}
            onPress={() => {
              setVisible(false);
            }}
          >
            <Feather name="x" size={24} color={"white"} />
          </TouchableOpacity>
        </View>

        <View style={styles.createView}>
          <View style={styles.textInputView}>
            <MaterialCommunityIcon
              name={"account-outline"}
              size={20}
              color={"#c9c9c9"}
              style={{ marginHorizontal: 15 }}
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Name"}
              placeholderTextColor={"#a8a8a8"}
              selectionColor={colors.primary}
              value={name}
              onChangeText={(text) => setName(text)}
              onSubmitEditing={() => priceRef.current?.focus()}
            />
          </View>
          <View style={styles.textInputView}>
            <MaterialCommunityIcon
              name={"currency-usd"}
              size={20}
              color={"#c9c9c9"}
              style={{ marginHorizontal: 15 }}
            />
            <TextInput
              style={styles.textInput}
              placeholder={"Price per hour"}
              placeholderTextColor={"#a8a8a8"}
              selectionColor={colors.primary}
              value={price}
              ref={priceRef}
              keyboardType="numeric"
              onChangeText={(text) => setPrice(text)}
            />
          </View>
          <ScrollView
            style={styles.typePicker}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setCourtType("Basketball");
              }}
              style={[
                styles.sportType,
                { marginLeft: 20 },
                courtType === "Basketball"
                  ? { borderColor: colors.primary }
                  : {},
              ]}
            >
              <Text
                style={[
                  styles.sportText,
                  courtType === "Basketball" ? { color: colors.primary } : {},
                ]}
              >
                Basketball
              </Text>
              <Image
                source={require("assets/images/home/basketball.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setCourtType("Football");
              }}
              style={[
                styles.sportType,
                courtType === "Football" ? { borderColor: colors.primary } : {},
              ]}
            >
              <Text
                style={[
                  styles.sportText,
                  courtType === "Football" ? { color: colors.primary } : {},
                ]}
              >
                Football
              </Text>
              <Image
                source={require("assets/images/home/football.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setCourtType("Tennis");
              }}
              style={[
                styles.sportType,
                { marginRight: 20 },
                courtType === "Tennis" ? { borderColor: colors.primary } : {},
              ]}
            >
              <Text
                style={[
                  styles.sportText,
                  courtType === "Tennis" ? { color: colors.primary } : {},
                ]}
              >
                Tennis
              </Text>
              <Image
                source={require("assets/images/home/tennis.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.contentView}>
            <View style={styles.contentIconView}>
              <MatComIcon
                name={"account-outline"}
                size={20}
                color={"white"}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.labelText}>How many players?</Text>
            </View>
            <View style={styles.contentIconView}>
              <TouchableOpacity
                onPress={() => {
                  if (numOfPlayers > 1) setNumOfPlayers((oldNum) => oldNum - 1);
                }}
              >
                <Feather name="minus-circle" color={colors.primary} size={24} />
              </TouchableOpacity>
              <Text
                style={[
                  styles.labelText,
                  { fontSize: 18, width: 40, textAlign: "center" },
                ]}
              >
                {numOfPlayers}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (numOfPlayers < 12)
                    setNumOfPlayers((oldNum) => oldNum + 1);
                }}
              >
                <Feather name="plus-circle" color={colors.primary} size={24} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <Text
              variant="labelLarge"
              style={{
                color: colors.tertiary,
              }}
            >
              Time Slots
            </Text>
            {selectedTimeSlots.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTimeSlots([]);
                }}
              >
                <Text style={styles.reset}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            style={{ flex: 1, marginVertical: 10 }}
            contentContainerStyle={styles.timeSlotsView}
          >
            {timeSlots?.map((timeSlot, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.timeSlotView,
                  selectedTimeSlots.includes(timeSlot.id!)
                    ? { borderColor: colors.primary }
                    : {},
                  pressed ? { backgroundColor: colors.background } : {},
                ]}
                onPress={() => {
                  if (!selectedTimeSlots.includes(timeSlot.id!)) {
                    setSelectedTimeSlots([...selectedTimeSlots, timeSlot.id!]);
                  } else
                    setSelectedTimeSlots(
                      selectedTimeSlots.filter(
                        (timeSlotId) => timeSlotId !== timeSlot.id
                      )
                    );
                }}
              >
                <Text style={styles.timeSlotText}>
                  {timeSlot.startTime} - {timeSlot.endTime}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Button
              textColor={colors.secondary}
              buttonColor={colors.primary}
              style={{ borderRadius: 5 }}
              onPress={() => {
                if (name && price) {
                  createCourt({
                    courtType,
                    name: name.trim(),
                    price: parseInt(price.trim()),
                    nbOfPlayers: numOfPlayers,
                    timeSlots: selectedTimeSlots,
                  });
                }
              }}
            >
              Create
            </Button>
          )}
        </View>
      </View>
    </React.Fragment>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    backgroundView: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "black",
      opacity: 0.5,
    },
    wrapperView: {
      position: "absolute",
      bottom: 0,
      height: "90%",
      width: "100%",
      backgroundColor: colors.background,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      paddingTop: 20,
    },
    header: {
      margin: 20,
      marginBottom: 40,
      flexDirection: "row",
      justifyContent: "center",
    },
    title: {
      fontFamily: "Inter-SemiBold",
      color: "white",
      fontSize: 16,
    },
    typePicker: {
      minHeight: 60,
      maxHeight: 60,
      marginHorizontal: -20,
    },
    sportType: {
      backgroundColor: colors.secondary,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      borderColor: colors.tertiary,
      borderWidth: 0.5,
      padding: 15,
      marginHorizontal: 5,
    },
    sportText: {
      fontFamily: "Inter-SemiBold",
      fontSize: 16,
      lineHeight: 16,
      marginRight: 10,
      color: "white",
    },
    createView: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20 },
    contentView: {
      backgroundColor: colors.secondary,
      marginTop: 15,
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: 10,
      borderColor: colors.tertiary,
      borderWidth: 0.5,
    },
    contentIconView: {
      flexDirection: "row",
      alignItems: "center",
    },
    labelText: {
      fontFamily: "Inter-Medium",
      color: "white",
    },
    buttonView: {
      marginVertical: 20,
      width: "100%",
    },
    textInputView: {
      marginBottom: 20,
      backgroundColor: colors.secondary,
      borderRadius: 5,
      height: 45,
      flexDirection: "row",
      alignItems: "center",
    },
    textInput: {
      flex: 1,
      paddingRight: 10,
      borderRadius: 5,
      fontSize: 14,
      color: "white",
      width: "100%",
      fontFamily: "Inter-Medium",
    },
    timeSlotsView: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    timeSlotView: {
      backgroundColor: colors.secondary,
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: colors.secondary,
    },
    timeSlotText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      fontSize: 12,
    },
    reset: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      marginRight: 10,
    },
  });