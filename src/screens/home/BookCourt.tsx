import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { AppHeader, BranchCard, BranchCardSkeleton } from "src/components";
import { StackParamList } from "src/navigation";
import { Branch, TimeSlot } from "src/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useSearchBranchesQuery } from "src/api";

type Props = StackScreenProps<StackParamList, "BookCourt">;

const stageTitles = [
  "Type of Sport",
  "Type of Court",
  "Dates",
  "",
  "",
  "Invite Friends",
  "",
];

const GameType = ({
  gameType,
  selectedGameType,
  setGameType,
}: {
  gameType: "Basketball" | "Football" | "Tennis";
  selectedGameType: "Basketball" | "Football" | "Tennis";
  setGameType: Dispatch<SetStateAction<"Basketball" | "Football" | "Tennis">>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.gameType,
        gameType === selectedGameType
          ? {
              backgroundColor: colors.primary,
            }
          : {},
      ]}
      onPress={() => setGameType(gameType)}
    >
      <Text
        style={[
          styles.title,
          gameType === selectedGameType
            ? {
                color: colors.background,
              }
            : {},
        ]}
      >
        {gameType}
      </Text>
    </TouchableOpacity>
  );
};

const CourtType = ({
  courtType,
  selectedCourtType,
  setCourtType,
}: {
  courtType: "Half Court" | "Full Court";
  selectedCourtType: "Half Court" | "Full Court";
  setCourtType: Dispatch<SetStateAction<"Half Court" | "Full Court">>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.gameType,
        courtType === selectedCourtType
          ? {
              backgroundColor: colors.primary,
            }
          : {},
      ]}
      onPress={() => setCourtType(courtType)}
    >
      <Text
        style={[
          styles.title,
          courtType === selectedCourtType
            ? {
                color: colors.background,
              }
            : {},
        ]}
      >
        {courtType}
      </Text>
    </TouchableOpacity>
  );
};

export const BookCourt = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { width: windowWidth } = useWindowDimensions();

  const [stage, setStage] = useState<number>(0);
  const [gameType, setGameType] = useState<
    "Basketball" | "Football" | "Tennis"
  >("Basketball");
  const [courtType, setCourtType] = useState<"Half Court" | "Full Court">(
    "Half Court"
  );
  const [searchDate, setSearchDate] = useState<Date>(new Date());
  const [searchTime, setSearchTime] = useState<TimeSlot>();
  const [branchSearchText, setBranchSearchText] = useState<string>("");

  const {
    data: branches,
    isLoading: branchesLoading,
    refetch: fetchBranches,
  } = useSearchBranchesQuery({
    date: `${searchDate.getFullYear()}-${(
      "0" +
      (searchDate.getMonth() + 1)
    ).slice(-2)}-${("0" + searchDate.getDate()).slice(-2)}`,
    gameType,
    startTime: undefined,
    endTime: undefined,
    nbOfPlayers: 1,
  });

  useEffect(() => {
    const handleBack = () => {
      if (stage > 0) {
        setStage(stage - 1);
        return true;
      } else return false;
    };
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, [stage]);

  return (
    <AppHeader
      absolutePosition={false}
      title={"Book a Court"}
      backEnabled
      onBack={(goBack: Function) => {
        if (stage > 0) setStage(stage - 1);
        else goBack();
      }}
    >
      <ScrollView contentContainerStyle={styles.wrapper}>
        {stage <= 2 && (
          <Text style={[styles.title, { marginBottom: 16 }]}>
            {stageTitles[stage]}
          </Text>
        )}
        {stage === 0 && (
          <View style={styles.gameTypes}>
            <GameType
              gameType="Basketball"
              selectedGameType={gameType}
              setGameType={setGameType}
            />
            <GameType
              gameType="Football"
              selectedGameType={gameType}
              setGameType={setGameType}
            />
            <GameType
              gameType="Tennis"
              selectedGameType={gameType}
              setGameType={setGameType}
            />
            {/* <GameType
              gameType="Padel Tennis"
              selectedGameType={gameType}
              setGameType={setGameType}
            />
            <GameType
              gameType="Volleyball"
              selectedGameType={gameType}
              setGameType={setGameType}
            /> */}
          </View>
        )}
        {stage === 1 && (
          <View style={styles.gameTypes}>
            <CourtType
              courtType="Half Court"
              selectedCourtType={courtType}
              setCourtType={setCourtType}
            />
            <CourtType
              courtType="Full Court"
              selectedCourtType={courtType}
              setCourtType={setCourtType}
            />
          </View>
        )}
        {stage === 2 && (
          <View style={{ flexGrow: 1 }}>
            <CalendarPicker
              width={windowWidth * 0.9}
              textStyle={{
                color: colors.tertiary,
                fontFamily: "Poppins-Medium",
              }}
              minDate={new Date()}
              todayBackgroundColor={colors.secondary}
              selectedDayStyle={{ backgroundColor: colors.primary }}
              selectedDayTextColor={colors.background}
              initialDate={searchDate ?? new Date()}
              onDateChange={(date) => {
                const parsedDate = date.toDate();
                setSearchDate(parsedDate);
              }}
              selectedStartDate={searchDate ?? new Date()}
            />
            <Text style={[styles.title, { marginTop: 24, marginBottom: 16 }]}>
              Duration ??
            </Text>
          </View>
        )}
        {stage === 3 && (
          <View style={{ flexGrow: 1 }}>
            <View style={styles.searchView}>
              <View style={styles.searchBarView}>
                <TextInput
                  style={styles.searchBar}
                  value={branchSearchText}
                  placeholder="Search"
                  placeholderTextColor={colors.tertiary}
                  cursorColor={colors.primary}
                  onChangeText={setBranchSearchText}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={branchSearchText === ""}
                  onPress={() => {
                    setBranchSearchText("");
                  }}
                >
                  <IonIcon
                    name={branchSearchText ? "close-outline" : "search-outline"}
                    color={colors.primary}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <IonIcon
                  name="filter-sharp"
                  size={18}
                  color={colors.onPrimary}
                />
              </TouchableOpacity>
            </View>
            <View>
              {branchesLoading && <BranchCardSkeleton type="horizontal" />}
              {!branchesLoading &&
                branches?.map((branch: Branch, index: number) => (
                  <BranchCard
                    key={index}
                    type="horizontal"
                    promoted={false}
                    branch={branch}
                  />
                ))}
              {!branchesLoading && (!branches || branches.length === 0) && (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    There are no courts that match your search.
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        <View style={styles.nextView}>
          <Button
            mode="contained"
            style={styles.next}
            onPress={() => {
              if (stage === 2) fetchBranches();
              setStage(stage + 1);
            }}
          >
            Next
          </Button>
        </View>
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: { flexGrow: 1, padding: 16 },
    title: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
    },
    text: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
    nextView: {
      borderColor: colors.secondary,
      borderTopWidth: 1,
      marginTop: 16,
      marginHorizontal: -16,
    },
    next: {
      height: 44,
      justifyContent: "center",
      marginTop: 24,
      marginBottom: 34,
      marginHorizontal: 16,
    },
    gameTypes: {
      flexDirection: "row",
      flexWrap: "wrap",
      flexGrow: 1,
    },
    gameType: {
      padding: 16,
      backgroundColor: colors.secondary,
      borderRadius: 12,
      marginRight: 16,
      marginBottom: 16,
    },
    searchView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      marginBottom: 24,
      height: 40,
    },
    searchBarView: {
      flexGrow: 1,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.secondary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginRight: 12,
      paddingRight: 16,
    },
    searchBar: {
      color: colors.tertiary,
      fontFamily: "Poppins-Regular",
      fontSize: 12,
      height: 40,
      flexGrow: 1,
      paddingHorizontal: 16,
    },
    placeholder: {
      height: 50,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      textAlign: "center",
    },
  });
