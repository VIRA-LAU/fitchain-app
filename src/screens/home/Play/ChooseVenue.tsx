import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader, VenueCard, VenueCardSkeleton } from "src/components";
import IonIcon from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";
import {
  useSortBranchesByLocationQuery,
  useSearchBranchesQuery,
} from "src/api";
import { VenueBranch } from "src/types";

type Props = StackScreenProps<HomeStackParamList, "ChooseVenue">;

export const ChooseVenue = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const {
    location,
    locationName,
    date: dateStr,
    startTime,
    endTime,
    gameType,
    nbOfPlayers,
  } = route.params;

  const date = new Date(JSON.parse(dateStr));
  const searchDate = `${date.getFullYear()}-${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

  const { data: branches } = useSearchBranchesQuery({
    date: searchDate,
    gameType,
    startTime,
    endTime,
    nbOfPlayers,
  });

  const { data: sortedBranches, isLoading } = useSortBranchesByLocationQuery(
    branches,
    location
  );

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Choose Venue Branch"}
      backEnabled
    >
      <ScrollView contentContainerStyle={styles.wrapperView}>
        <View style={styles.infoView}>
          <IonIcon name={"location-outline"} size={20} color={"white"} />
          <Text variant="labelLarge" style={styles.information}>
            {locationName}
          </Text>
        </View>
        <View style={[styles.infoView, { marginBottom: 20 }]}>
          <IonIcon name={"calendar-outline"} size={20} color={"white"} />
          <Text variant="labelLarge" style={styles.information}>
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        {isLoading && <VenueCardSkeleton type="horizontal" />}
        {!isLoading && (!sortedBranches || sortedBranches.length === 0) && (
          <Text style={styles.placeholderText}>
            There are no venue branches that match your search.
          </Text>
        )}
        {!isLoading &&
          sortedBranches?.map((venuesBranch: VenueBranch, index: number) => (
            <VenueCard
              key={index}
              type="horizontal"
              venueBranch={venuesBranch}
              promoted={false}
              isPlayScreen
              playScreenBookingDetails={{
                date: dateStr,
                startTime,
                endTime,
                gameType,
                nbOfPlayers,
              }}
            />
          ))}
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    infoView: {
      marginBottom: 10,
      flexDirection: "row",
    },
    information: {
      marginLeft: 10,
      color: "white",
    },
    wrapperView: {
      margin: 20,
    },
    placeholderText: {
      height: 100,
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
      textAlignVertical: "center",
    },
  });
