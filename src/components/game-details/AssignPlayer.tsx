import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { BottomModal } from "../modals";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { Button, Text, useTheme } from "react-native-paper";
import { PlayerStatistics, PlayerStatus, TeamPlayer } from "src/types";
import { PlayerCard } from "./PlayerCard";
import { useAssignPlayerScoreMutation } from "src/api";

export const AssignPlayer = ({
  playerStatistics,
  setVisible,
  players,
  playerStatus,
  gameId,
}: {
  playerStatistics: PlayerStatistics | null;
  setVisible: Dispatch<SetStateAction<PlayerStatistics | null>>;
  players?: TeamPlayer[];
  playerStatus?: PlayerStatus;
  gameId?: number;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { width: windowWidth } = useWindowDimensions();

  const {
    mutate: assignPlayer,
    isLoading,
    isSuccess,
  } = useAssignPlayerScoreMutation(gameId);

  const [scrollViewOffset, setScrollViewOffset] = useState<number>(0);

  const filteredPlayers = players?.filter(
    (player) => player.team == playerStatistics?.team
  );

  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (isSuccess) setVisible(null);
  }, [isSuccess]);

  if (!playerStatus || !filteredPlayers || !playerStatistics || !gameId)
    return <View />;
  return (
    <BottomModal
      visible={playerStatistics != null}
      setVisible={(value) => {
        if (!value) setVisible(null);
      }}
    >
      <View style={styles.wrapper}>
        <Text
          style={{
            color: colors.tertiary,
            fontFamily: "Inter-SemiBold",
            textAlign: "center",
          }}
        >
          Player AI ID: {playerStatistics?.processedId}
        </Text>
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
          {filteredPlayers.map((player: TeamPlayer, index: number) => (
            <PlayerCard
              key={index}
              player={player}
              isActive={index === scrollViewOffset}
              isPrevious={true}
              gameId={0}
              playerStatus={playerStatus}
              isFirst={index === 0}
              isLast={index === filteredPlayers.length - 1}
              index={index}
              scrollRef={scrollRef}
              isPressable={false}
            />
          ))}
        </ScrollView>

        <Button
          mode="contained"
          loading={isLoading}
          style={{ marginHorizontal: 20 }}
          onPress={() => {
            assignPlayer({
              playerStatisticsId: playerStatistics.id,
              userId: filteredPlayers[scrollViewOffset].id,
            });
          }}
        >
          Assign
        </Button>
      </View>
    </BottomModal>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      marginTop: "auto",
      marginBottom: "auto",
      marginLeft: "auto",
      marginRight: "auto",
      paddingVertical: 20,
      backgroundColor: colors.background,
    },
    playerCardView: {
      height: 300,
      flexDirection: "row",
    },
  });
