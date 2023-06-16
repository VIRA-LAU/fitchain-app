import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import {
  AppHeader,
  BranchLocation,
  BranchLocationSkeleton,
} from "src/components";
import IonIcon from "react-native-vector-icons/Ionicons";
import {
  useSearchBranchesQuery,
  useSortBranchesByLocationQuery,
} from "src/api";
import { ScrollView } from "react-native-gesture-handler";

type Props = StackScreenProps<HomeStackParamList, "VenueBranches">;

export const VenueBranches = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const {
    id,
    venueName,
    location,
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
    venueId: id,
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
      right={<IonIcon name="ellipsis-horizontal" color="white" size={24} />}
      title={"Branches"}
      searchBar
      backEnabled
    >
      {!isLoading && (!sortedBranches || sortedBranches.length === 0) && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            There are no branches that match your search.
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.wrapperView}>
        {isLoading && <BranchLocationSkeleton />}
        {!isLoading &&
          sortedBranches?.map((branch, index: number) => {
            return (
              <BranchLocation
                key={index}
                type="branch"
                isPressable
                branch={{
                  venueName,
                  location: branch.location,
                  courts: branch.courts,
                  rating: branch.rating,
                  latitude: branch.latitude,
                  longitude: branch.longitude,
                }}
                playScreenBookingDetails={{
                  date: dateStr,
                  gameType,
                  startTime,
                  endTime,
                  nbOfPlayers,
                }}
              />
            );
          })}
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      marginHorizontal: "3%",
    },
    placeholder: {
      height: 150,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
    },
  });
