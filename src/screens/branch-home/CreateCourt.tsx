import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  MutableRefObject,
} from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { GameType, TimeSlot } from "src/types";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useCreateCourtMutation, useUpdateCourtMutation } from "src/api";
import {
  BottomModal,
  TimeSlotPicker,
  getMins,
  parseTimeFromMinutes,
} from "src/components";
import { existingCourtType } from "./BranchManagement";

var timeSlotIndexToEdit: number | undefined;

export const CreateCourt = ({
  visible,
  setVisible,
  existingInfo = {
    courtId: 0,
    name: "",
    price: "",
    courtType: "Basketball",
    numOfPlayers: 6,
    timeSlots: [],
  },
}: {
  visible: "create" | "edit" | false;
  setVisible: Dispatch<SetStateAction<"create" | "edit" | false>>;
  isEditing?: boolean;
  existingInfo?: existingCourtType;
}) => {
  const { colors } = useTheme();
  const windowWidth = useWindowDimensions().width;
  const styles = makeStyles(colors, windowWidth);

  const [name, setName] = useState<string>(existingInfo.name);
  const [price, setPrice] = useState<string>(existingInfo.price.toString());
  const [courtType, setCourtType] = useState<GameType>(existingInfo.courtType);
  const [numOfPlayers, setNumOfPlayers] = useState<number>(
    existingInfo.numOfPlayers
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [timeSlotPickerVisible, setTimeSlotPickerVisible] = useState(false);

  const resetFields = () => {
    setName("");
    setPrice("");
    setCourtType("Basketball");
    setNumOfPlayers(6);
    setTimeSlots([]);
  };

  const { mutate: createCourt, isLoading: createLoading } =
    useCreateCourtMutation(() => {
      resetFields();
      setVisible(false);
    });
  const { mutate: updateCourt, isLoading: updateLoading } =
    useUpdateCourtMutation(() => {
      resetFields();
      setVisible(false);
    });

  const priceRef: MutableRefObject<TextInput | null> = useRef(null);

  useEffect(() => {
    if (existingInfo && visible === "edit") {
      setName(existingInfo.name);
      setPrice(existingInfo.price);
      setCourtType(existingInfo.courtType);
      setNumOfPlayers(existingInfo.numOfPlayers);
      setTimeSlots(existingInfo.timeSlots);
    } else resetFields();
  }, [visible, JSON.stringify(existingInfo)]);

  return (
    <BottomModal
      visible={visible !== false}
      setVisible={(state) => {
        if (!state) setVisible(false);
      }}
    >
      <View style={styles.wrapperView}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {visible === "edit" ? "Edit" : "Create a"} Court
          </Text>
          <TouchableOpacity
            style={{ position: "absolute", right: 0 }}
            onPress={() => {
              setVisible(false);
            }}
          >
            <Feather name="x" size={24} color={"white"} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.createView}>
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
          </View>
          <View style={styles.timeSlotsView}>
            {timeSlots.map((timeSlot, index) => (
              <View key={index} style={styles.timeSlotView}>
                <Text style={styles.timeSlotText}>
                  {parseTimeFromMinutes(getMins(timeSlot.startTime as Date))}
                  {" - "}
                  {parseTimeFromMinutes(getMins(timeSlot.endTime as Date))}
                </Text>
                <View style={{ marginLeft: "auto", flexDirection: "row" }}>
                  <Button
                    onPress={() => {
                      timeSlotIndexToEdit = index;
                      setTimeSlotPickerVisible(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    textColor="#ff4500"
                    onPress={() => {
                      setTimeSlots(
                        timeSlots.filter(
                          (slot, slotIndex) => index !== slotIndex
                        )
                      );
                    }}
                  >
                    Remove
                  </Button>
                </View>
              </View>
            ))}
            <Button
              onPress={() => {
                setTimeSlotPickerVisible(true);
              }}
            >
              Add New Time Slot
            </Button>
          </View>

          <View style={{ marginTop: "auto" }}>
            <Button
              mode="contained"
              style={{ borderRadius: 5, marginTop: 20 }}
              loading={createLoading || updateLoading}
              onPress={
                !(createLoading || updateLoading)
                  ? () => {
                      if (visible === "create") {
                        if (name && price && timeSlots.length > 0) {
                          createCourt({
                            courtType,
                            name: name.trim(),
                            price: parseInt(price.trim()),
                            nbOfPlayers: numOfPlayers,
                            timeSlots,
                          });
                        }
                      } else {
                        if (name && price) {
                          updateCourt({
                            courtId: existingInfo.courtId,
                            courtType,
                            name: name.trim(),
                            price: parseInt(price.trim()),
                            nbOfPlayers: numOfPlayers,
                            timeSlots,
                          });
                        }
                      }
                    }
                  : undefined
              }
            >
              {visible === "edit" ? "Update" : "Create"}
            </Button>
          </View>
        </ScrollView>
      </View>
      <TimeSlotPicker
        visible={timeSlotPickerVisible}
        time={
          typeof timeSlotIndexToEdit !== "undefined"
            ? timeSlots[timeSlotIndexToEdit]
            : {
                startTime: new Date("2000-01-01T12:00:00.000Z"),
                endTime: new Date("2000-01-01T14:00:00.000Z"),
              }
        }
        occupiedTimes={timeSlots.filter((slot) =>
          typeof timeSlotIndexToEdit !== "undefined"
            ? slot.id !== timeSlots[timeSlotIndexToEdit].id
            : true
        )}
        setVisible={setTimeSlotPickerVisible}
        onPress={(tempTime) => {
          if (typeof timeSlotIndexToEdit !== "undefined") {
            setTimeSlots(
              timeSlots.map((slot, index) =>
                index === timeSlotIndexToEdit ? { ...slot, ...tempTime } : slot
              )
            );
            timeSlotIndexToEdit = undefined;
          } else {
            if (timeSlots) setTimeSlots([...timeSlots, tempTime]);
            else setTimeSlots([tempTime]);
          }
          setTimeSlotPickerVisible(false);
        }}
        constrained={"partial"}
        showEndTime
      />
    </BottomModal>
  );
};

const makeStyles = (colors: MD3Colors, windowWidth: number) =>
  StyleSheet.create({
    wrapperView: {
      marginTop: "auto",
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
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 10,
    },
    timeSlotView: {
      backgroundColor: colors.secondary,
      flexDirection: "row",
      borderRadius: 5,
      width: "100%",
      alignItems: "center",
      padding: 10,
      paddingLeft: 20,
      marginVertical: 5,
    },
    timeSlotText: {
      fontFamily: "Inter-Medium",
      color: "white",
    },
  });
