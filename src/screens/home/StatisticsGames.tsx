import { useContext } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { useStatisticsGamesQuery } from "src/api";
import { AppHeader, StatisticsGameCard } from "src/components";
import { UserContext } from "src/utils";

export const StatisticsGames = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { userData } = useContext(UserContext);

  const {
    data: games,
    isFetching,
    refetch,
  } = useStatisticsGamesQuery(userData?.userId);

  console.log(games);
  return (
    <AppHeader title="Games" absolutePosition={false} backEnabled>
      <ScrollView
        contentContainerStyle={styles.wrapper}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[colors.primary]}
          />
        }
      >
        {games?.map((game, index) => (
          <StatisticsGameCard key={index} game={game} />
        ))}
        {!isFetching &&
          (!games ||
            (games?.length === 0 && (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  You have not played any games yet.
                </Text>
              </View>
            )))}
      </ScrollView>
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
    },
    placeholderText: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      textAlign: "center",
    },
  });
