import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useGetPlayerTeamQuery, useUpdateGameMutation } from "src/api";
import { useContext, useEffect, useState } from "react";
import { Game } from "src/types";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { UserContext } from "src/utils";

export const ResultCard = ({ game }: { game?: Game }) => {
  const { userData } = useContext(UserContext);
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [team, setTeam] = useState<string | undefined>("");
  const [message, setMessage] = useState<string>("");

  const [isChangingScore, setIsChangingScore] = useState<boolean>(false);
  const [tempHomeScore, setTempHomeScore] = useState<number | undefined>(
    game?.homeScore
  );
  const [tempAwayScore, setTempAwayScore] = useState<number | undefined>(
    game?.awayScore
  );

  const { data: playersTeam } = useGetPlayerTeamQuery(game?.id);
  const { mutate: updateScore } = useUpdateGameMutation(
    game?.id,
    setIsChangingScore
  );

  useEffect(() => {
    setTeam(game?.winnerTeam);
    if (playersTeam?.team && playersTeam?.team !== "none") {
      if (game?.winnerTeam == "DRAW") {
        setMessage("It's a draw!");
      } else if (game?.winnerTeam === playersTeam.team) {
        setMessage("Congrats!");
      } else {
        setMessage("Hardluck!");
      }
    } else if (game?.winnerTeam === "DRAW") setMessage("It's a draw!");
    else setMessage(`${game?.winnerTeam} team wins!`);
  }, [JSON.stringify(playersTeam), JSON.stringify(game)]);

  return (
    <View>
      <Text variant="labelLarge" style={{ color: colors.tertiary, margin: 20 }}>
        Teams
      </Text>
      <View style={{ alignContent: "center", alignItems: "center" }}>
        <Text style={styles.result}>{message}</Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ alignItems: "center" }}>
            {isChangingScore ? (
              <TextInput
                textColor="white"
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
                {game?.homeScore}
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
          </View>
          <View>
            <Text
              variant="labelLarge"
              style={{
                color: colors.tertiary,
                marginTop: 50,
                marginHorizontal: 20,
              }}
            >
              vs
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            {isChangingScore ? (
              <TextInput
                textColor="white"
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
                {game?.awayScore}
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
                onPress={() => {
                  updateScore({
                    homeScore: tempHomeScore,
                    awayScore: tempAwayScore,
                  });
                }}
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
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    result: {
      color: "white",
      fontSize: 18,
      fontWeight: "800",
    },
    teamLabel: {
      fontSize: 12,
      color: colors.tertiary,
      fontWeight: "400",
    },
    scoreInput: {
      color: "white",
      fontSize: 30,
      padding: 10,
      marginVertical: 10,
      backgroundColor: colors.secondary,
    },
  });
