import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader } from "src/components";
import { useBranchesQuery } from "src/api";
import { useContext, useState } from "react";
import { UserContext } from "src/utils";
import { ScrollView } from "react-native-gesture-handler";
import { CourtCard } from "src/components/game-details/CourtCard";

type Props = StackScreenProps<HomeStackParamList, "BranchCourts">;

export const BranchCourts = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { userData } = useContext(UserContext);
  const { data: branchesVenues } = useBranchesQuery();

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Select Court"}
      backEnabled
    >
      <View style={styles.wrapperView}>
        <ScrollView>
          <Text
            variant="labelLarge"
            style={[{ color: colors.tertiary }, styles.locationComponent]}
          >
            Hoops Club, Hazmieh
          </Text>
          <CourtCard />
          <CourtCard />
          <CourtCard />
          <CourtCard />
          <CourtCard />
        </ScrollView>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    locationComponent: {
      margin: 20,
    },
    wrapperView: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
