import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader } from "src/components";
import { ScrollView } from "react-native-gesture-handler";
import { CourtCard } from "src/components/game-details/CourtCard";

type Props = StackScreenProps<HomeStackParamList, "BranchCourts">;

export const BranchCourts = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { courts, venueName, branchLocation, bookingDetails } = route.params;

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Select Court"}
      backEnabled
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text variant="labelLarge" style={styles.locationComponent}>
          {venueName}, {branchLocation}
        </Text>
        {courts.map((court, index: number) => (
          <CourtCard
            key={index}
            id={court.id}
            venueName={venueName}
            type={court.courtType}
            price={court.price}
            bookingDetails={bookingDetails}
            // rating={court.rating}
          />
        ))}
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    locationComponent: {
      color: colors.tertiary,
      margin: 20,
    },
  });
