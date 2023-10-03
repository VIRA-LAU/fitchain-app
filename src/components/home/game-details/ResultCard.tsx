import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import { useGetPlayerTeamQuery, useUpdateGameMutation } from "src/api";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Game } from "src/types";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { UserContext } from "src/utils";
import { Skeleton } from "../Skeleton";
import { Highlights } from "./Highlights";
import { TopPlayerCircle } from "./PlayerCircle";

export const ResultCard = ({
  game,
  setVideoFocusVisible,
  loading,
}: {
  game?: Game;
  setVideoFocusVisible: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
}) => {
  const { userData } = useContext(UserContext);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [team, setTeam] = useState<string | undefined>("");
  const [message, setMessage] = useState<string>("");

  const [isChangingScore, setIsChangingScore] = useState<boolean>(false);
  const [tempHomeScore, setTempHomeScore] = useState<number | undefined>(
    game?.updatedHomePoints
  );
  const [tempAwayScore, setTempAwayScore] = useState<number | undefined>(
    game?.updatedAwayPoints
  );

  const { data: playersTeam, isLoading: teamLoading } = useGetPlayerTeamQuery(
    game?.id
  );

  const { mutate: updateScore, isLoading: updateScoreLoading } =
    useUpdateGameMutation(game?.id, setIsChangingScore);

  useEffect(() => {
    if (game && playersTeam) {
      const winnerTeam =
        game.updatedHomePoints === game.updatedAwayPoints
          ? "DRAW"
          : game.updatedHomePoints > game.updatedAwayPoints
          ? "HOME"
          : "AWAY";

      setTeam(winnerTeam);
      if (winnerTeam == "DRAW") {
        setMessage("It's a draw!");
      } else if (playersTeam?.team && playersTeam?.team !== "none") {
        if (winnerTeam === playersTeam.team) {
          setMessage("Congrats!");
        } else {
          setMessage("Hardluck!");
        }
      } else setMessage(`${winnerTeam} team wins!`);
    }
  }, [JSON.stringify(playersTeam), JSON.stringify(game)]);

  useEffect(() => {
    if (game) {
      setTempHomeScore(game.updatedHomePoints);
      setTempAwayScore(game.updatedAwayPoints);
    }
  }, [JSON.stringify(game)]);

  if (!game || teamLoading || loading)
    return (
      <View>
        <Text
          variant="labelLarge"
          style={{ color: colors.tertiary, margin: 20 }}
        >
          Score
        </Text>
        <View style={{ alignContent: "center", alignItems: "center" }}>
          <Skeleton height={20} width={100} style={{ marginBottom: 20 }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Skeleton height={100} width={80} />
            <Text
              variant="labelLarge"
              style={{
                color: colors.tertiary,
                marginHorizontal: 20,
              }}
            >
              vs
            </Text>
            <Skeleton height={100} width={80} />
          </View>
        </View>
      </View>
    );

  return (
    <View>
      <Text variant="labelLarge" style={{ color: colors.tertiary, margin: 20 }}>
        Score
      </Text>
      <View style={{ alignContent: "center", alignItems: "center" }}>
        <Text style={styles.result}>{message}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
            {isChangingScore ? (
              <TextInput
                textColor={colors.tertiary}
                keyboardType="numeric"
                value={tempHomeScore?.toString()}
                onChangeText={(text) =>
                  setTempHomeScore(text ? parseInt(text) : 0)
                }
                style={styles.scoreInput}
              />
            ) : (
              <Text
                style={{
                  color: team === "HOME" ? "white" : colors.tertiary,
                  fontSize: 70,
                }}
              >
                {game.updatedHomePoints}
              </Text>
            )}
            <Text
              style={{
                color: team === "HOME" ? "white" : colors.tertiary,
                fontWeight: "800",
              }}
            >
              HOME
            </Text>
            {playersTeam && playersTeam.team !== "none" && (
              <Text style={styles.teamLabel}>
                {playersTeam?.team === "HOME" ? "Your Team" : "Opponent"}
              </Text>
            )}
            <Text style={[styles.teamLabel, { marginTop: 5 }]}>
              Possession: {game.homePossession}
            </Text>
          </View>
          <Text
            variant="labelLarge"
            style={{
              color: colors.tertiary,
              marginHorizontal: 20,
            }}
          >
            vs
          </Text>
          <View style={{ alignItems: "center" }}>
            {isChangingScore ? (
              <TextInput
                textColor={colors.tertiary}
                keyboardType="numeric"
                value={tempAwayScore?.toString()}
                onChangeText={(text) =>
                  setTempAwayScore(text ? parseInt(text) : 0)
                }
                style={styles.scoreInput}
              />
            ) : (
              <Text
                style={{
                  color: team === "AWAY" ? "white" : colors.tertiary,
                  fontSize: 70,
                }}
              >
                {game.updatedAwayPoints}
              </Text>
            )}
            <Text
              style={{
                color: team === "AWAY" ? "white" : colors.tertiary,
                fontWeight: "800",
              }}
            >
              AWAY
            </Text>
            {playersTeam && playersTeam.team !== "none" && (
              <Text style={styles.teamLabel}>
                {playersTeam?.team === "AWAY" ? "Your Team" : "Opponent"}
              </Text>
            )}
            <Text style={[styles.teamLabel, { marginTop: 5 }]}>
              Possession: {game.awayPossession}
            </Text>
          </View>
        </View>
        {game?.admin.id === userData?.userId &&
          (!isChangingScore ? (
            <Button
              style={{ marginTop: 20 }}
              onPress={() => setIsChangingScore(true)}
            >
              Change Score
            </Button>
          ) : (
            <View>
              <Button
                style={{ marginTop: 20 }}
                loading={updateScoreLoading}
                onPress={
                  !updateScoreLoading
                    ? () => {
                        updateScore({
                          updatedHomePoints: tempHomeScore,
                          updatedAwayPoints: tempAwayScore,
                        });
                      }
                    : undefined
                }
              >
                Confirm
              </Button>
              <Button
                onPress={() => setIsChangingScore(false)}
                textColor={"#ff4500"}
              >
                Cancel
              </Button>
            </View>
          ))}
      </View>
      <View style={styles.divider} />
      <Text
        variant="labelLarge"
        style={{ color: colors.tertiary, marginVertical: 20, marginLeft: 20 }}
      >
        Top Players
      </Text>
      <ScrollView
        style={{ flexGrow: 1, marginHorizontal: 10 }}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {["MVP", "Top Scorer", "Team Player", "3-Points"].map(
          (achievement, index) => (
            <TopPlayerCircle
              key={index}
              achievement={achievement}
              isAdmin={game?.admin.id === userData?.userId}
            />
          )
        )}
      </ScrollView>
      <View style={styles.divider} />
      <Highlights game={game} setVideoFocusVisible={setVideoFocusVisible} />
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    result: {
      color: colors.tertiary,
      fontSize: 18,
      fontWeight: "800",
    },
    teamLabel: {
      fontSize: 12,
      color: colors.tertiary,
      fontWeight: "400",
    },
    scoreInput: {
      color: colors.tertiary,
      fontSize: 30,
      padding: 10,
      marginVertical: 10,
      backgroundColor: colors.secondary,
    },
    divider: {
      borderColor: colors.secondary,
      borderBottomWidth: 1,
      marginTop: 10,
    },
  });