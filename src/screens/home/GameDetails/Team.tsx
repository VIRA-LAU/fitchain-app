import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { BranchLocation, PlayerCard, Update } from "components";
import { Game, TeamPlayer } from "src/types";
import { useUpdatesQuery } from "src/api";
import { ReactNode, useEffect, useState } from "react";
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

  const { data: gameUpdates } = useUpdatesQuery(game.id);

  const [upcomingGame, setUpcomingGame] = useState<boolean>();
  const [activePlayer, setActivePlayer] = useState<number>(0);

  let updateCards: { card: ReactNode; date: Date }[] = [];

  if (gameUpdates) {
    updateCards.push({
      card: (
        <Update
          key="created"
          type="create"
          name={`${gameUpdates.admin.firstName} ${gameUpdates.admin.lastName}`}
          date={new Date(gameUpdates.createdAt)}
          gameId={game.id}
        />
      ),
      date: new Date(gameUpdates.createdAt),
    });
    gameUpdates.gameInvitation.forEach((invitation, index) => {
      if (invitation.status !== "REJECTED")
        updateCards.push({
          card: (
            <Update
              key={`invitation-${index}`}
              type={invitation.status === "APPROVED" ? "join" : "invitation"}
              name={
                invitation.status === "APPROVED"
                  ? `${invitation.friend.firstName} ${invitation.friend.lastName}`
                  : `${invitation.user.firstName} ${invitation.user.lastName}`
              }
              friendName={`${invitation.friend.firstName} ${invitation.friend.lastName}`}
              date={new Date(invitation.createdAt)}
              gameId={game.id}
            />
          ),
          date: new Date(invitation.createdAt),
        });
    });
    gameUpdates.gameRequests.forEach((request, index) => {
      if (request.status !== "REJECTED")
        updateCards.push({
          card: (
            <Update
              key={`request-${index}`}
              type={request.status === "APPROVED" ? "join" : "join-request"}
              name={`${request.user.firstName} ${request.user.lastName}`}
              date={new Date(request.createdAt)}
              requestId={request.id}
              gameId={game.id}
            />
          ),
          date: new Date(request.createdAt),
        });
    });
    updateCards = updateCards.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }

  useEffect(() => {
    const currentDate = new Date();
    const gameDate = new Date(game.date);
    if (gameDate < currentDate) {
      setUpcomingGame(false);
    } else setUpcomingGame(true);
  }, [game.date]);

  if (typeof upcomingGame === "undefined") return <View />;
  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View>
        {!upcomingGame && (
          <View>
            <ResultCard game={game}></ResultCard>
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
        {updateCards.map(({ card }) => card)}
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
