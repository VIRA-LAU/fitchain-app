import { StackScreenProps } from "@react-navigation/stack";
import { Fragment, useContext, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { useGameResultsQuery } from "src/api";
import {
  AppHeader,
  ResultCard,
  TopPlayerCircle,
  VideoPlayerModal,
} from "src/components";
import { HomeStackParamList } from "src/navigation";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { PlayerStatistics } from "src/types";
import { UserContext } from "src/utils";
import { ResizeMode, Video } from "expo-av";

type Props = StackScreenProps<HomeStackParamList, "GameResults">;

export const GameNDetails = ({
  gameNumber,
  playerStatistics,
}: {
  gameNumber: number;
  playerStatistics: PlayerStatistics[];
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  if (gameNumber !== -1)
    playerStatistics = playerStatistics.filter(
      (player) => player.gameNumber === gameNumber
    );
  else {
    var initial: { [key: string]: PlayerStatistics[] } = {};

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
    return a === b ? 0 : a > b ? -1 : 1;
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
                <Text style={styles.playerName}>
                  Player {player.processedId}
                </Text>

                <View style={styles.row}>
                  <View style={styles.item}>
                    <Text style={styles.label}>2 Points</Text>
                    <Text style={styles.value}>{player.twoPointsMade}</Text>
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.label}>3 Points</Text>
                    <Text style={styles.value}>{player.threePointsMade}</Text>
                  </View>
                  {/* <View style={styles.item}>
                    <Text style={styles.label}>2P Total</Text>
                    <Text style={styles.value}>
                      {player.twoPointsMade + player.twoPointsMissed}
                    </Text>
                  </View> */}
                </View>

                <View style={styles.row}>
                  <View style={styles.item}>
                    <Text style={styles.label}>Shots Made</Text>
                    <Text style={styles.value}>{player.scored}</Text>
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.label}>Shots Missed</Text>
                    <Text style={styles.value}>{player.missed}</Text>
                  </View>
                  <View style={styles.item}>
                    <Text style={styles.label}>Shots Accuracy</Text>
                    <Text style={styles.value}>{player.accuracy * 100}%</Text>
                  </View>
                </View>

                {player.scorePerFrame.length > 0 && (
                  <View style={{ alignSelf: "center" }}>
                    <View style={styles.item}>
                      <Text style={styles.label}>Score per Frame</Text>
                      {player.scorePerFrame.map((score, index) => (
                        <Text
                          style={(styles.value, { fontSize: 14 })}
                          key={index}
                        >
                          {score}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
                {/* <View style={styles.row}>
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
                </View> */}
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
  playerStatistics: PlayerStatistics[];
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

export const GameResults = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { id } = route.params;
  const { userData } = useContext(UserContext);

  const { data: gameResults, isLoading: resultsLoading } =
    useGameResultsQuery(id);

  const [focusedVideo, setFocusedVideo] = useState<string | undefined>(
    undefined
  );

  const numberOfGames = gameResults
    ? Math.max(
        ...gameResults.playerStatistics.map((player) => player.gameNumber)
      )
    : 0;

  if (!gameResults) return <View />;
  return (
    <Fragment>
      <AppHeader title="Game Results" absolutePosition={false} backEnabled>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          <ResultCard game={gameResults} loading={resultsLoading} detailed />
          <View style={styles.divider} />
          {numberOfGames > 0 && (
            <View>
              <Text
                variant="labelLarge"
                style={{
                  color: colors.tertiary,
                  marginTop: 20,
                  marginLeft: 20,
                  fontSize: 16,
                }}
              >
                Player Statistics
              </Text>
              <GameNDetails
                gameNumber={1}
                playerStatistics={gameResults.playerStatistics}
              />
              {/* <View style={{ flexGrow: 0, minHeight: 700 }}> */}
              {/* <Tabs
                  numberOfGames={numberOfGames}
                  playerStatistics={gameResults.playerStatistics}
                /> */}
              {/* </View> */}
            </View>
          )}

          {gameResults.videoPath && (
            <View>
              <View style={styles.divider} />
              <Text
                variant="labelLarge"
                style={{
                  color: colors.tertiary,
                  marginVertical: 20,
                  marginLeft: 20,
                  fontSize: 16,
                }}
              >
                Full Video
              </Text>
              <View
                style={{
                  marginLeft: 0.05 * Dimensions.get("screen").width,
                }}
              >
                <TouchableRipple
                  borderless
                  style={{
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    setFocusedVideo(gameResults.videoPath);
                  }}
                >
                  <Video
                    source={{
                      uri: gameResults.videoPath,
                    }}
                    isLooping
                    shouldPlay
                    resizeMode={ResizeMode.COVER}
                    style={{
                      width: 0.9 * Dimensions.get("screen").width,
                      height: 235,
                      borderRadius: 10,
                    }}
                  />
                </TouchableRipple>
              </View>
            </View>
          )}
          {gameResults.highlights.length > 0 && (
            <View>
              <View style={styles.divider} />
              <Text
                variant="labelLarge"
                style={{
                  color: colors.tertiary,
                  marginVertical: 20,
                  marginLeft: 20,
                  fontSize: 16,
                }}
              >
                Highlights
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {gameResults?.highlights.map((video, index) => (
                  <View
                    key={index}
                    style={{
                      marginLeft: index === 0 ? 20 : 5,
                      marginRight: 5,
                    }}
                  >
                    <TouchableRipple
                      borderless
                      style={{
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        setFocusedVideo(video);
                      }}
                    >
                      <Video
                        source={{
                          uri: video,
                        }}
                        isLooping
                        shouldPlay
                        resizeMode={ResizeMode.COVER}
                        style={{
                          width: 0.4 * Dimensions.get("screen").width,
                          height: 235,
                          borderRadius: 10,
                        }}
                      />
                    </TouchableRipple>
                    <Text
                      style={{
                        color: colors.tertiary,
                        fontFamily: "Poppins-Regular",
                        textAlign: "center",
                        marginTop: 10,
                      }}
                    >
                      {video.split("/").pop()?.split(".")[0]}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
          <View style={styles.divider} />
          <Text
            variant="labelLarge"
            style={{
              color: colors.tertiary,
              marginVertical: 20,
              marginLeft: 20,
              fontSize: 16,
            }}
          >
            Top Players
          </Text>
          <ScrollView
            style={{ flexGrow: 1, marginHorizontal: -10 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {["MVP", "Top Scorer", "Team Player", "3-Points"].map(
              (achievement, index) => (
                <TopPlayerCircle
                  key={index}
                  achievement={achievement}
                  isAdmin={gameResults?.admin?.id === userData?.userId}
                />
              )
            )}
          </ScrollView>
          <View style={styles.divider} />
        </ScrollView>
      </AppHeader>
      <VideoPlayerModal video={focusedVideo} setVideo={setFocusedVideo} />
    </Fragment>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    divider: {
      borderColor: colors.secondary,
      borderBottomWidth: 1,
      marginTop: 10,
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
      fontFamily: "Poppins-Medium",
      color: colors.tertiary,
      fontSize: 14,
      textTransform: "capitalize",
      // textAlign: "center",
    },
    playerName: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      fontSize: 16,
      textAlign: "center",
      marginBottom: 8,
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 10,
      gap: 40,
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
      color: "black",
      fontSize: 18,
    },
  });
