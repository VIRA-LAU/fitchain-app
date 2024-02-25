import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { BranchCard, BranchCardSkeleton } from "src/components";
import { useBranchesQuery } from "src/api";
import { Dispatch, SetStateAction, useState } from "react";
import { Branch } from "src/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { GameCreationType } from "./CreateGame";

export const BranchSelection = ({
  gameDetails,
  setGameDetails,
}: {
  gameDetails: GameCreationType;
  setGameDetails: Dispatch<SetStateAction<GameCreationType>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { gameType, branch: selectedBranch } = gameDetails;

  const { data: branches, isLoading } = useBranchesQuery();

  const [searchBarText, setSearchBarText] = useState<string>("");

  const filteredBranches = branches?.filter((branch) =>
    branch.venue.name.toLowerCase().includes(searchBarText.toLowerCase())
  );

  filteredBranches?.push({
    id: -1,
    rating: 0,
    venue: {
      name: "Other",
      id: -1,
    },
    allowsBooking: false,
    courts: [
      {
        id: -1,
        courtType: gameType,
        name: "Other",
        price: 0,
      },
    ],
  });

  var branchPrices: string[] = [];

  if (filteredBranches)
    branchPrices = filteredBranches.map((branch) =>
      branch.courts.length === 1
        ? branch.courts[0].price.toString()
        : `${Math.min.apply(
            null,
            branch.courts.map((court) => court.price)
          )}-${Math.max.apply(
            null,
            branch.courts.map((court) => court.price)
          )}`
    );

  return (
    <View style={{ flexGrow: 1 }}>
      <View style={styles.searchView}>
        <View style={styles.searchBarView}>
          <TextInput
            style={styles.searchBar}
            value={searchBarText}
            placeholder="Search"
            placeholderTextColor={colors.tertiary}
            cursorColor={colors.primary}
            onChangeText={setSearchBarText}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={searchBarText === ""}
            onPress={() => {
              setSearchBarText("");
            }}
          >
            <IonIcon
              name={searchBarText ? "close-outline" : "search-outline"}
              color={colors.primary}
              size={20}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
        >
          <IonIcon name="filter-sharp" size={18} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ flex: 1, marginHorizontal: -16 }}
        contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
      >
        {isLoading && <BranchCardSkeleton type="horizontal" />}
        {!isLoading &&
          filteredBranches?.map((branch: Branch, index: number) => (
            <TouchableRipple
              key={index}
              borderless
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor:
                  selectedBranch?.id === branch.id
                    ? colors.primary
                    : "transparent",
              }}
              onPress={() => {
                if (selectedBranch?.id === branch.id)
                  setGameDetails({
                    ...gameDetails,
                    branch: undefined,
                    court: undefined,
                  });
                else
                  setGameDetails({
                    ...gameDetails,
                    branch,
                    court: branch.courts[0],
                  });
              }}
            >
              <BranchCard
                type="horizontal"
                promoted={false}
                branch={branch}
                price={branchPrices[index]}
                disabled
              />
            </TouchableRipple>
          ))}
        {!isLoading && (!filteredBranches || filteredBranches.length === 0) && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              There are no nearby branches.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    placeholder: {
      height: 50,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      textAlign: "center",
    },
    searchView: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      marginBottom: 24,
      height: 40,
    },
    searchBarView: {
      flexGrow: 1,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.secondary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginRight: 12,
      paddingRight: 16,
    },
    searchBar: {
      color: colors.tertiary,
      fontFamily: "Poppins-Regular",
      fontSize: 12,
      height: 40,
      flexGrow: 1,
      paddingHorizontal: 16,
    },
  });
