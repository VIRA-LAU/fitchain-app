import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { BranchLocation, PlayerCard, Update } from "components";
import { Game, TeamPlayer } from "src/types";
import { useEffect, useState } from "react";
import { useGetPlayerTeamQuery } from "src/api";
import { ResultCard } from "src/components/game-details/ResultCard";

export const Team = ({
  name,
  game,
  players,
}: {
  name: "Home" | "Away";
  game: Game;
  players?: TeamPlayer[];
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [upcomingGame, setUpcomingGame] = useState<boolean>();
  const [activePlayer, setActivePlayer] = useState<number>(0);
  useEffect(() => {
    const currentDate = new Date();
    const gameDate = new Date(game.date);
    if (gameDate < currentDate) {
      setUpcomingGame(false);
    }
  }, [game.date]);
  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View>
        {upcomingGame == false && (
          <View>
            <ResultCard game={game} upcomingGame={upcomingGame}></ResultCard>
            <View style={styles.divider} />
          </View>
        )}
        {players && players.length > 0 && (
          <ScrollView
            style={styles.playerCardView}
            contentContainerStyle={{
              alignItems: "center",
              paddingHorizontal: 20,
            }}
            horizontal
          >
            {players?.map((player: TeamPlayer, index: number) => (
              <PlayerCard
                key={index}
                player={player}
                isActive={index === activePlayer}
                index={index}
                setActivePlayer={setActivePlayer}
                upcoming={upcomingGame}
                gameId={game.id}
              />
            ))}
          </ScrollView>
        )}
        {(!players || players.length === 0) && (
          <Text style={styles.placeholderText}>
            There are no players on this team.
          </Text>
        )}
      </View>

      <Image
        style={{ height: 120, maxWidth: "100%", marginBottom: 20 }}
        resizeMode="contain"
        source={require("assets/images/home/basketball-court.png")}
      />
      <View style={{ marginHorizontal: 20, marginBottom: -10 }}>
        <BranchLocation type="court" court={game.court} team={name} />
      </View>
      <View style={styles.divider} />
      <Text variant="labelLarge" style={{ color: colors.tertiary, margin: 20 }}>
        Updates
      </Text>
      <View style={styles.updatesView}>
        <Update type="join-request" />
        <Update type="join" />
        <Update type="photo-upload" />
      </View>
    </ScrollView>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    playerCardView: {
      height: 300,
      flexDirection: "row",
    },
    divider: {
      borderColor: colors.secondary,
      borderBottomWidth: 1,
      marginTop: 20,
    },
    updatesView: {
      marginHorizontal: 20,
    },
    placeholderText: {
      height: 120,
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
      textAlignVertical: "center",
    },
  });
