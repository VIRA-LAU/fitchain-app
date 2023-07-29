import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { StackParamList } from "navigation";
import { AppHeader, BranchCard, BranchCardSkeleton } from "src/components";
import IonIcon from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";
import {
  useSortBranchesByLocationQuery,
  useSearchBranchesQuery,
} from "src/api";
import { Branch } from "src/types";

type Props = StackScreenProps<StackParamList, "ChooseBranch">;

export const ChooseBranch = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const {
    location,
    locationName,
    date: dateStr,
    time,
    gameType,
    nbOfPlayers,
  } = route.params;

  const date = new Date(JSON.parse(dateStr));
  const searchDate = `${date.getFullYear()}-${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

  const { data: branches, isLoading: branchesLoading } = useSearchBranchesQuery(
    {
      date: searchDate,
      gameType,
      startTime: "",
      endTime: "",
      nbOfPlayers,
    }
  );

  const { data: sortedBranches, isLoading: sortingLoading } =
    useSortBranchesByLocationQuery(branches, location);

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Choose a Venue"}
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
        {(branchesLoading || sortingLoading) && (
          <BranchCardSkeleton type="horizontal" />
        )}
        {!(branchesLoading || sortingLoading) &&
          (!sortedBranches || sortedBranches.length === 0) && (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                There are no branches that match your search.
              </Text>
            </View>
          )}
        {!(branchesLoading || sortingLoading) &&
          sortedBranches?.map((branch: Branch, index: number) => (
            <BranchCard
              key={index}
              type="horizontal"
              branch={branch}
              promoted={false}
              playScreenBookingDetails={{
                date: dateStr,
                time,
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
    placeholder: {
      height: 100,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
    },
  });
