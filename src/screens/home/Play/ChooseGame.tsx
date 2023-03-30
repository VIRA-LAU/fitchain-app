import { StackScreenProps } from "@react-navigation/stack";
import { ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSearchGamesQuery } from "src/api";
import { AppHeader, BookingCard } from "src/components";
import { HomeStackParamList } from "src/navigation";
import { Game } from "src/types";
import { DayHeader } from "../Games";

type Props = StackScreenProps<HomeStackParamList, "ChooseGame">;

export const ChooseGame = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
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

  games?.forEach((game: Game, index: number) => {
    const gameDate = new Date(
      game.date.toISOString().substring(0, game.date.toISOString().indexOf("T"))
    );
    const todayDate = new Date(
      today.toISOString().substring(0, today.toISOString().indexOf("T"))
    );
    const dayDiff =
      (gameDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24);

    if (dayDiff === 1 && !dayHeaders.includes("tomorrow")) {
      dayHeaders.push("tomorrow");
      gameCards.push(<DayHeader key={"tomorrow"} day="Tomorrow" />);
    } else if (
      dayDiff > 1 &&
      dayDiff <= 7 &&
      !dayHeaders.includes("this-week")
    ) {
      dayHeaders.push("this-week");
      gameCards.push(<DayHeader key={"this-week"} day="This Week" />);
    } else if (
      dayDiff > 7 &&
      dayDiff <= 30 &&
      !dayHeaders.includes("this-month")
    ) {
      dayHeaders.push("this-month");
      gameCards.push(<DayHeader key={"this-month"} day="This Month" />);
    } else if (dayDiff > 30 && !dayHeaders.includes("future")) {
      dayHeaders.push("future");
      gameCards.push(<DayHeader key={"future"} day="In the Future" />);
    }

    gameCards.push(<BookingCard key={index} booking={game} />);
  });

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Choose Game"}
      backEnabled
    >
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
