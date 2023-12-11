import { StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { useStatisticsGameDetailsQuery } from "src/api";
import { AppHeader } from "src/components";
import { StatisticsGameStatus } from "src/enum-types";
import { StackParamList } from "src/navigation";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { StatisticsGamePlayer } from "src/types";

type Props = StackScreenProps<StackParamList, "StatisticsGameDetails">;

export const GameNDetails = ({
  gameNumber,
  playerStatistics,
}: {
  gameNumber: number;
  playerStatistics: StatisticsGamePlayer[];
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (gameNumber !== -1)
    playerStatistics = playerStatistics.filter(
      (player) => player.gameNumber === gameNumber
    );
  else {
    var initial: { [key: string]: StatisticsGamePlayer[] } = {};

    const grouped = playerStatistics.reduce(
      (acc, current) => ({
        ...acc,
        [current.name]: (acc[current.name] || []).concat(current),
      }),
      initial
    );

    playerStatistics = Object.keys(grouped).map((key) =>
      grouped[key].reduce((acc, current) => ({
        ...acc,
        twoPointsMade: acc.twoPointsMade + current.twoPointsMade,
        twoPointsMissed: acc.twoPointsMissed + current.twoPointsMissed,
        threePointsMade: acc.threePointsMade + current.threePointsMade,
        threePointsMissed: acc.threePointsMissed + current.threePointsMissed,
        assists: acc.assists + current.assists,
        blocks: acc.blocks + current.blocks,
        rebounds: acc.rebounds + current.rebounds,
        steals: acc.steals + current.steals,
      }))
    );
  }

  const teams = [
    ...new Set(playerStatistics.map((player) => player.team)),
  ].sort((a, b) => {
    return a === b ? 0 : a < b ? -1 : 1;
  });

  if (!teams || !playerStatistics) return <View />;
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {teams.map((team, teamIndex) => (
        <View key={teamIndex}>
          <Text style={styles.teamName}>Team: {team}</Text>
          {playerStatistics
            .filter((player) => player.team === team)
            .map((player, playerIndex) => (
              <View key={playerIndex}>
                <Text style={styles.playerName}>{player.name}</Text>

                <View style={styles.row}>
                  <View style={styles.item}>
                    <Text style={styles.label}>2P Made</Text>
                    <Text style={styles.value}>{player.twoPointsMade}</Text>
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.label}>2P Missed</Text>
                    <Text style={styles.value}>{player.twoPointsMissed}</Text>
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.label}>2P Total</Text>
                    <Text style={styles.value}>
                      {player.twoPointsMade + player.twoPointsMissed}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.item}>
                    <Text style={styles.label}>3P Made</Text>
                    <Text style={styles.value}>{player.threePointsMade}</Text>
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.label}>3P Missed</Text>
                    <Text style={styles.value}>{player.threePointsMissed}</Text>
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.label}>3P Total</Text>
                    <Text style={styles.value}>
                      {player.threePointsMade + player.threePointsMissed}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.item}>
                    <Text style={styles.label}>Assists</Text>
                    <Text style={styles.value}>{player.assists}</Text>
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.label}>Rebounds</Text>
                    <Text style={styles.value}>{player.rebounds}</Text>
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.label}>Blocks</Text>
                    <Text style={styles.value}>{player.blocks}</Text>
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.label}>Steals</Text>
                    <Text style={styles.value}>{player.steals}</Text>
                  </View>
                </View>
              </View>
            ))}
        </View>
      ))}
    </ScrollView>
  );
};

const Tabs = ({
  numberOfGames,
  playerStatistics,
}: {
  numberOfGames: number;
  playerStatistics: StatisticsGamePlayer[];
}) => {
  const { colors } = useTheme();
  const layout = useWindowDimensions();

  const arr = Array.from(Array(numberOfGames).keys());

  const [index, setIndex] = useState(0);
  const [routes] = useState(
    arr
      .map((i) => ({
        key: `game${i}`,
        title: `Game ${i + 1}`,
      }))
      .concat(arr.length === 1 ? [] : [{ key: "total", title: "Total" }])
  );

  const sceneMap: any = {};

  routes.forEach((route, i) => {
    sceneMap[route.key] = () => (
      <GameNDetails
        gameNumber={route.key === "total" ? -1 : i + 1}
        playerStatistics={playerStatistics}
      />
    );
  });

  const renderScene = SceneMap(sceneMap);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={{ backgroundColor: colors.background }}
          renderLabel={(props) => (
            <Text
              {...props}
              style={{
                color: props.focused ? colors.primary : colors.tertiary,
                fontFamily: "Poppins-Regular",
              }}
            >
              {props.route.title}
            </Text>
          )}
          indicatorStyle={{ backgroundColor: colors.primary }}
        />
      )}
    />
  );
};

export const StatisticsGameDetails = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { id } = route.params;

  const { data: gameDetails } = useStatisticsGameDetailsQuery(id);

  const numberOfGames = gameDetails
    ? Math.max(
        ...gameDetails.playerStatistics.map((player) => player.gameNumber)
      )
    : 0;

  if (!gameDetails) return <View />;
  return (
    <AppHeader title="Game Details" absolutePosition={false} backEnabled>
      {gameDetails.status === StatisticsGameStatus.PENDING ||
      gameDetails.status === StatisticsGameStatus.INPROGRESS ||
      gameDetails.playerStatistics.length === 0 ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Your request is being processed, please check again later.
          </Text>
        </View>
      ) : (
        <Tabs
          numberOfGames={numberOfGames}
          playerStatistics={gameDetails.playerStatistics}
        />
      )}
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      padding: 16,
    },
    placeholder: {
      height: 200,
      justifyContent: "center",
      alignItems: "center",
    },
    placeholderText: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      textAlign: "center",
      maxWidth: "80%",
    },
    teamName: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
      fontSize: 18,
      textAlign: "center",
    },
    playerName: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      fontSize: 18,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    item: {
      marginBottom: 5,
    },
    label: {
      fontFamily: "Poppins-Regular",
      color: "gray",
      fontSize: 12,
    },
    value: {
      fontFamily: "Poppins-Regular",
      color: "gray",
      fontSize: 14,
    },
  });
