import { StackScreenProps } from "@react-navigation/stack";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { sortGamesByLocation, useSearchGamesQuery } from "src/api";
import { AppHeader, BookingCard } from "src/components";
import { HomeStackParamList } from "src/navigation";
import { Game } from "src/types";
import { DayHeader } from "../Games";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

type Props = StackScreenProps<HomeStackParamList, "ChooseGame">;

export const ChooseGame = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const today = new Date();
  const gameCards: JSX.Element[] = [];
  const dayHeaders: string[] = [];

  const {
    location,
    date: dateStr,
    startTime,
    endTime,
    gameType,
  } = route.params;

  const date = dateStr ? new Date(JSON.parse(dateStr)) : undefined;
  const searchDate = date
    ? `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
        "0" + date.getDate()
      ).slice(-2)}`
    : undefined;

  const { data: games } = useSearchGamesQuery({
    gameType,
    date: searchDate,
    startTime,
    endTime,
  });

  const [sortedGames, setSortedGames] = useState<Game[] | undefined>(games);
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<"date" | "location">("date");

  useEffect(() => {
    setTimeout(() => {
      setModalVisible(false);
    }, 10);
    if (games && games.length > 0) {
      if (sortOption === "location") {
        const sortGames = async () => {
          const sorted = await sortGamesByLocation(games, location);
          setSortedGames(sorted);
        };
        sortGames();
      } else {
        setSortedGames(
          games.sort((a, b) => a.date.getTime() - b.date.getTime())
        );
      }
    }
  }, [sortOption]);

  sortedGames?.forEach((game: Game, index: number) => {
    const gameDate = new Date(
      game.date.toISOString().substring(0, game.date.toISOString().indexOf("T"))
    );
    const todayDate = new Date(
      today.toISOString().substring(0, today.toISOString().indexOf("T"))
    );
    const dayDiff =
      (gameDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24);

    if (dayDiff === 1 && dayHeaders[dayHeaders.length - 1] !== "tomorrow") {
      dayHeaders.push("tomorrow");
      gameCards.push(<DayHeader key={`tomorrow${index}`} day="Tomorrow" />);
    } else if (
      dayDiff > 1 &&
      dayDiff <= 7 &&
      dayHeaders[dayHeaders.length - 1] !== "this-week"
    ) {
      dayHeaders.push("this-week");
      gameCards.push(<DayHeader key={`this-week${index}`} day="This Week" />);
    } else if (
      dayDiff > 7 &&
      dayDiff <= 30 &&
      dayHeaders[dayHeaders.length - 1] !== "this-month"
    ) {
      dayHeaders.push("this-month");
      gameCards.push(<DayHeader key={`this-month${index}`} day="This Month" />);
    } else if (dayDiff > 30 && dayHeaders[dayHeaders.length - 1] !== "future") {
      dayHeaders.push("future");
      gameCards.push(<DayHeader key={`future${index}`} day="In the Future" />);
    }

    gameCards.push(<BookingCard key={index} booking={game} />);
  });

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Choose Game"}
      right={
        <MaterialIcon
          name="sort"
          color={"white"}
          size={24}
          onPress={() => {
            setModalVisible(true);
          }}
        />
      }
      backEnabled
    >
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableOpacity
          style={styles.transparentView}
          onPress={() => {
            setModalVisible(false);
          }}
        />
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Sort By</Text>
          <Pressable
            onPress={() => {
              setSortOption("date");
            }}
          >
            <View style={styles.selectionRow}>
              <Text
                variant="labelLarge"
                style={{
                  color: "white",
                }}
              >
                Date
              </Text>
              {sortOption === "date" && (
                <FeatherIcon
                  name="check"
                  color={"white"}
                  size={26}
                  style={{ marginLeft: "auto" }}
                />
              )}
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setSortOption("location");
            }}
          >
            <View style={styles.selectionRow}>
              <Text
                variant="labelLarge"
                style={{
                  color: "white",
                }}
              >
                Location
              </Text>
              {sortOption === "location" && (
                <FeatherIcon
                  name="check"
                  color={"white"}
                  size={26}
                  style={{ marginLeft: "auto" }}
                />
              )}
            </View>
          </Pressable>
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
      >
        <DayHeader day="Today" />
        <Text
          variant="headlineSmall"
          style={{
            color: "white",
            marginTop: -5,
            marginBottom: 10,
          }}
        >
          {today.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        {gameCards}
        {gameCards.length === 0 && (
          <Text
            style={{
              height: 100,
              fontFamily: "Inter-Medium",
              color: colors.tertiary,
              textAlign: "center",
              textAlignVertical: "center",
            }}
          >
            There are no games that match your search.
          </Text>
        )}
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    transparentView: {
      position: "absolute",
      height: "100%",
      width: "100%",
    },
    modalView: {
      width: 180,
      marginTop: 75,
      marginLeft: "auto",
      marginRight: 10,
      backgroundColor: colors.secondary,
      borderRadius: 20,
      paddingHorizontal: 25,
      paddingVertical: 10,
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
    modalTitle: {
      fontFamily: "Inter-Medium",
      marginTop: 10,
      color: colors.tertiary,
    },
    selectionRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      height: 30,
    },
  });
