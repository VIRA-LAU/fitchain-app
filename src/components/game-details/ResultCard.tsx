import { Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import { useGetPlayerTeamQuery } from "src/api";
import { useEffect, useState } from "react";
import { Game } from "src/types";

export const ResultCard = ({ game }: { game: Game }) => {
  const { colors } = useTheme();
  const { data: playersTeam } = useGetPlayerTeamQuery(game.id);
  const [team, setTeam] = useState<string>("HOME");
  const [message, setMessage] = useState<string>("Congrats!");

  useEffect(() => {
    if (playersTeam) {
      setTeam(playersTeam.team);
      if (game.winnerTeam == "Draw") {
        setMessage("Draw!");
      } else if (game.winnerTeam != playersTeam.team) {
        setMessage("Hardluck!");
      }
    }
  }, [playersTeam]);

  return (
    <View>
      <Text variant="labelLarge" style={{ color: colors.tertiary, margin: 20 }}>
        Teams
      </Text>
      <View style={{ alignContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: "white",
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
  );
};
