import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { PlayerCard, PlayerCardSkeleton, TopPlayersCard } from "components";
import { Game, GameStats, PlayerStatus, TeamPlayer } from "src/types";
import { useEffect, useRef, useState } from "react";

export const Team = ({
  game,
  players,
  playersLoading,
  isPrevious,
  playerStatus,
  teamIndex,
  gameStats,
}: {
  game?: Game;
  players?: TeamPlayer[];
  playersLoading: boolean;
  isPrevious: boolean;
  playerStatus?: PlayerStatus;
  teamIndex: number;
  gameStats?: GameStats;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const windowWidth = useWindowDimensions().width;

  const [scrollViewOffset, setScrollViewOffset] = useState<number>(0);

  useEffect(() => {
    setScrollViewOffset(0);
  }, [teamIndex]);

  const scrollRef = useRef<ScrollView | null>(null);

  return (
    <View style={{ backgroundColor: colors.background }}>
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
          }}
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          horizontal
          scrollEventThrottle={8}
          onScroll={(event) => {
            let offset = event.nativeEvent.contentOffset.x;
            offset = Math.round(offset / (0.4 * windowWidth));
            if (offset !== scrollViewOffset) setScrollViewOffset(offset);
          }}
        >
          {players.map((player: TeamPlayer, index: number) => (
            <PlayerCard
              key={index}
              player={player}
              isActive={index === scrollViewOffset}
              isPrevious={isPrevious}
              gameId={game?.id}
              playerStatus={playerStatus}
              isFirst={index === 0}
              isLast={index === players.length - 1}
              index={index}
              scrollRef={scrollRef}
            />
          ))}
        </ScrollView>
      )}
      {!playersLoading && (!players || players.length === 0) && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            There are no players on this team.
          </Text>
        </View>
      )}
      {isPrevious && (
        <View>
          <Text
            variant="labelLarge"
            style={{
              color: colors.tertiary,
              marginTop: 20,
              marginLeft: 20,
            }}
          >
            Player Scores
          </Text>
          <ScrollView
            style={{ flexGrow: 1, marginHorizontal: 10 }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {gameStats &&
              Object.keys(gameStats[`team${teamIndex + 1}`].playerPoints).map(
                (player, index) => (
                  <TopPlayersCard
                    key={index}
                    playerName={"Assign Player"}
                    achievement={`Score: ${
                      gameStats[`team${teamIndex + 1}`].playerPoints[player]
                        .scored
                    }`}
                  />
                )
              )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    playerCardView: {
      height: 300,
      flexDirection: "row",
    },
    placeholder: {
      height: 120,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
    },
  });
