import { StackScreenProps } from "@react-navigation/stack";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSortGamesByLocationQuery, useSearchGamesQuery } from "src/api";
import { AppHeader, BookingCard, SortByModal } from "src/components";
import { StackParamList } from "src/navigation";
import { Game, TimeSlot } from "src/types";
import { DayHeader } from "../Games";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

type Props = StackScreenProps<StackParamList, "ChooseGame">;

export const ChooseGame = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const today = new Date();
  const gameCards: JSX.Element[] = [];
  const dayHeaders: string[] = [];

  const { location, date: dateStr, time, gameType, nbOfPlayers } = route.params;

  const date = dateStr ? new Date(dateStr) : undefined;

  const searchDate = date
    ? `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
        "0" + date.getDate()
      ).slice(-2)}`
    : undefined;

  const { data: games } = useSearchGamesQuery({
    gameType,
    date: searchDate,
    startTime: time?.startTime as string,
    endTime: time?.endTime as string,
    nbOfPlayers,
  });

  const { data: sortedGamesByLocation, refetch: sortGamesByLocation } =
    useSortGamesByLocationQuery(games, location);

  const [sortedGames, setSortedGames] = useState<Game[] | undefined>(games);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<"date" | "location">("date");

  useEffect(() => {
    if (games && games.length > 0) {
      if (sortOption === "location") {
        sortGamesByLocation();
      } else {
        setSortedGames(
          games.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        );
      }
    }
    setModalVisible(false);
  }, [sortOption, JSON.stringify(games)]);

  useEffect(() => {
    if (sortOption === "location" && sortedGamesByLocation) {
      setSortedGames(sortedGamesByLocation);
    }
  }, [sortOption, JSON.stringify(sortedGamesByLocation)]);

  sortedGames?.forEach((game: Game, index: number) => {
    const gameDate = new Date(
      game.startTime
        .toISOString()
        .substring(0, game.startTime.toISOString().indexOf("T"))
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

    gameCards.push(
      <BookingCard key={index} booking={game} isPrevious={false} />
    );
  });

  return (
    <AppHeader
      absolutePosition={false}
      title={"Choose Game"}
      right={
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <MaterialIcon name="sort" color={"white"} size={24} />
        </TouchableOpacity>
      }
      backEnabled
    >
      <SortByModal
        visible={modalVisible}
        setVisible={setModalVisible}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
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
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              There are no games that match your search.
            </Text>
          </View>
        )}
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    placeholder: {
      height: 100,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      textAlign: "center",
    },
  });
