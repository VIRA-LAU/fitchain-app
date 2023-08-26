import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { PlayerCard, PlayerCardSkeleton, ScorePlayerCircle } from "components";
import { Game, PlayerStatus, TeamPlayer } from "src/types";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "src/utils";

export const Team = ({
  game,
  players,
  playersLoading,
  isPrevious,
  playerStatus,
  teamIndex,
}: {
  game?: Game;
  players?: TeamPlayer[];
  playersLoading: boolean;
  isPrevious: boolean;
  playerStatus?: PlayerStatus;
  teamIndex: number;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const windowWidth = useWindowDimensions().width;
  const { userData } = useContext(UserContext);

  const [scrollViewOffset, setScrollViewOffset] = useState<number>(0);

  useEffect(() => {
    setScrollViewOffset(0);
  }, [teamIndex]);

  const scrollRef = useRef<ScrollView | null>(null);

  const playerStatistics =
    teamIndex === 0
      ? game?.playerStatistics.filter((player) => player.team === "HOME")
      : game?.playerStatistics.filter((player) => player.team === "AWAY");

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
      {isPrevious && game && game.playerStatistics.length > 0 && (
        <View>
          <Text
            variant="labelLarge"
            style={{
              color: colors.tertiary,
              marginVertical: 20,
              marginLeft: 20,
            }}
          >
            Player Scores
          </Text>
          <ScrollView
            style={{ flexGrow: 1, marginHorizontal: 10, marginBottom: 10 }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {playerStatistics?.map(({ player, scored, missed }, index) => (
              <ScorePlayerCircle
                key={index}
                player={player}
                scored={scored}
                missed={missed}
                isAdmin={game?.admin.id === userData?.userId}
              />
            ))}
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
