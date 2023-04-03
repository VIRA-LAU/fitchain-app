import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { View, StyleSheet, Image } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useGetPlayerTeamQuery } from "src/api";
import { useEffect, useState } from "react";
import { Game } from "src/types";

type textOptions = "join-request" | "join" | "photo-upload";

const updateText = (type: textOptions) => {
  if (type === "join-request") return " requested to join the game.";
  else if (type === "join") return " joined the game.";
  else if (type === "photo-upload") return " uploaded a photo.";
};

export const ResultCard = ({
  game,
  upcomingGame,
}: {
  game: Game;
  upcomingGame: boolean;
}) => {
  const { colors } = useTheme();
  const { data: playersTeam } = useGetPlayerTeamQuery(game.id);
  const [team, setTeam] = useState<string>("HOME");
  const [message, setMessage] = useState<string>("Congrats!");
  useEffect(() => {
    if (playersTeam) {
      setTeam(playersTeam["team"]);
      if (game["winnerTeam"] != playersTeam["team"]) {
        setMessage("Hardluck!");
      } else if (game["winnerTeam"] == "Draw") {
        setMessage("Draw!");
      }
    }
  }, [playersTeam]);
  return (
    <View>
      {!upcomingGame && (
        <View>
          <Text
            variant="labelLarge"
            style={{ color: colors.tertiary, margin: 20 }}
          >
            Teams
          </Text>
          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "white",
                margin: 20,
                fontSize: 18,
                fontWeight: "800",
              }}
            >
              {message}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    color: team === "HOME" ? "white" : colors.tertiary,
                    fontSize: 70,
                  }}
                >
                  {game.homeScore}
                </Text>
                <Text
                  style={{
                    color: team === "HOME" ? "white" : colors.tertiary,
                    fontWeight: "800",
                  }}
                >
                  HOME
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.tertiary,
                    fontWeight: "400",
                  }}
                >
                  Opponent
                </Text>
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
                <Text
                  style={{
                    color: team === "AWAY" ? "white" : colors.tertiary,
                    fontSize: 70,
                  }}
                >
                  {game.awayScore}
                </Text>
                <Text
                  style={{
                    color: team === "AWAY" ? "white" : colors.tertiary,
                    fontWeight: "800",
                  }}
                >
                  AWAY
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.tertiary,
                    fontWeight: "400",
                  }}
                >
                  Your Team
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
