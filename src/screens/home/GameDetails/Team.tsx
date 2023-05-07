import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  BranchLocation,
  BranchLocationSkeleton,
  PlayerCard,
  PlayerCardSkeleton,
  UpdateCard,
  UpdateCardSkeleton,
  ResultCard,
  TopPlayersCard,
} from "components";
import { Game, PlayerStatus, TeamPlayer } from "src/types";
import { useUpdatesQuery } from "src/api";
import { ReactNode, useState } from "react";

export const Team = ({
  name,
  game,
  players,
  gameDetailsLoading,
  playersLoading,
  isPrevious,
  playerStatus,
}: {
  name: "Home" | "Away";
  game?: Game;
  players?: TeamPlayer[];
  gameDetailsLoading: boolean;
  playersLoading: boolean;
  isPrevious: boolean;
  playerStatus?: PlayerStatus;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { data: gameUpdates, isFetching: updatesLoading } = useUpdatesQuery(
    game?.id
  );

  const [activePlayer, setActivePlayer] = useState<number>(0);

  let updateCards: { card: ReactNode; date: Date }[] = [];

  if (gameUpdates) {
    updateCards.push({
      card: (
        <UpdateCard
          key="created"
          type="create"
          name={`${gameUpdates.admin.firstName} ${gameUpdates.admin.lastName}`}
          date={new Date(gameUpdates.createdAt)}
          gameId={game?.id}
        />
      ),
      date: new Date(gameUpdates.createdAt),
    });
    gameUpdates.gameInvitation.forEach((invitation, index) => {
      if (invitation.status !== "REJECTED")
        updateCards.push({
          card: (
            <UpdateCard
              key={`invitation-${index}`}
              type={invitation.status === "APPROVED" ? "join" : "invitation"}
              name={
                invitation.status === "APPROVED"
                  ? `${invitation.friend.firstName} ${invitation.friend.lastName}`
                  : `${invitation.user.firstName} ${invitation.user.lastName}`
              }
              friendName={`${invitation.friend.firstName} ${invitation.friend.lastName}`}
              date={new Date(invitation.createdAt)}
              gameId={game?.id}
            />
          ),
          date: new Date(invitation.createdAt),
        });
    });
    gameUpdates.gameRequests.forEach((request, index) => {
      if (request.status !== "REJECTED")
        updateCards.push({
          card: (
            <UpdateCard
              key={`request-${index}`}
              type={request.status === "APPROVED" ? "join" : "join-request"}
              name={`${request.user.firstName} ${request.user.lastName}`}
              date={new Date(request.createdAt)}
              requestId={request.id}
              gameId={game?.id}
            />
          ),
          date: new Date(request.createdAt),
        });
    });
    updateCards = updateCards.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View>
        {isPrevious && (
          <View>
            <ResultCard game={game} />
            <View style={styles.divider} />
            <Text
              variant="labelLarge"
              style={{ color: colors.tertiary, marginTop: 20, marginLeft: 20 }}
            >
              Top Players
            </Text>
            <ScrollView
              style={{ flexGrow: 1 }}
              contentContainerStyle={{ minWidth: 480 }}
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  flexDirection: "row",
                  marginBottom: 20,
                }}
              >
                <TopPlayersCard
                  playerName={null}
                  achievement="MVP"
                ></TopPlayersCard>
                <TopPlayersCard
                  playerName={null}
                  achievement="Top Scorer"
                ></TopPlayersCard>
                <TopPlayersCard
                  playerName={null}
                  achievement="Team Player"
                ></TopPlayersCard>
                <TopPlayersCard
                  playerName={null}
                  achievement="3-Points"
                ></TopPlayersCard>
              </View>
            </ScrollView>
            <View style={styles.divider} />
          </View>
        )}
        <Text
          variant="labelLarge"
          style={{ color: colors.tertiary, marginTop: 20, marginLeft: 20 }}
        >
          Team Players
        </Text>
        {playersLoading && (
          <View
            style={[
              styles.playerCardView,
              {
                alignItems: "center",
                paddingHorizontal: 20,
              },
            ]}
          >
            <PlayerCardSkeleton />
          </View>
        )}
        {!playersLoading && players && players.length > 0 && (
          <ScrollView
            style={styles.playerCardView}
            contentContainerStyle={{
              alignItems: "center",
              paddingHorizontal: 20,
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {players.map((player: TeamPlayer, index: number) => (
              <PlayerCard
                key={index}
                player={player}
                isActive={index === activePlayer}
                index={index}
                setActivePlayer={setActivePlayer}
                isPrevious={isPrevious}
                gameId={game?.id}
                playerStatus={playerStatus}
              />
            ))}
          </ScrollView>
        )}

        {!playersLoading && (!players || players.length === 0) && (
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
        {gameDetailsLoading ? (
          <BranchLocationSkeleton />
        ) : (
          <BranchLocation type="court" court={game?.court} team={name} />
        )}
      </View>
      <View style={styles.divider} />
      <Text variant="labelLarge" style={{ color: colors.tertiary, margin: 20 }}>
        Updates
      </Text>
      <View style={styles.updatesView}>
        {updatesLoading && <UpdateCardSkeleton />}
        {!updatesLoading && updateCards.map(({ card }) => card)}
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
