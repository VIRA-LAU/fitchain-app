import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { VenueLocation, PlayerCard, Update } from "components";

export const Home = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <ScrollView
        style={styles.playerCardView}
        contentContainerStyle={{ alignItems: "center" }}
        horizontal
      >
        <PlayerCard />
        <PlayerCard isActive />
        <PlayerCard />
      </ScrollView>

      <Image
        style={{ height: 120, maxWidth: "100%", marginBottom: 20 }}
        resizeMode="contain"
        source={require("assets/images/home/basketball-court.png")}
      />
      <View style={{ marginHorizontal: 20, marginBottom: -10 }}>
        <VenueLocation />
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
  });
