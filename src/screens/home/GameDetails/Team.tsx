import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { BranchLocation, PlayerCard, Update } from "components";
import { Game, TeamPlayer } from "src/types";

export const Team = ({
  name,
  game,
  adminId,
  players,
}: {
  name: "Home" | "Away";
  game: Game;
  adminId?: number;
  players?: TeamPlayer[];
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View>
        {players && players.length > 0 && (
          <ScrollView
            style={styles.playerCardView}
            contentContainerStyle={{
              alignItems: "center",
              marginHorizontal: 20,
            }}
            horizontal
          >
            {players?.map((player: TeamPlayer, index: number) => (
              <PlayerCard
                key={index}
                player={player}
                isActive={player.id === adminId}
              />
            ))}
          </ScrollView>
        )}
        {(!players || players.length === 0) && (
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
        <BranchLocation type="court" court={game.court} team={name} />
      </View>
      <View style={styles.divider} />
      <Text variant="labelLarge" style={{ color: colors.tertiary, margin: 20 }}>
        Updates
      </Text>
      <View style={styles.updatesView}>
        <Update type="join-request" />
        <Update type="join" />
        <Update type="photo-upload" />
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
      height: 80,
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
      textAlignVertical: "center",
    },
  });
