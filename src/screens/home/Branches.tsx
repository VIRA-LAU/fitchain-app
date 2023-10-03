import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { AppHeader, BranchCard, BranchCardSkeleton } from "src/components";
import { useBranchesQuery } from "src/api";
import { useState } from "react";
import { Branch } from "src/types";
import IonIcon from "react-native-vector-icons/Ionicons";

export const Branches = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { data: branches, isLoading } = useBranchesQuery();

  const [searchBarText, setSearchBarText] = useState<string>("");
  const [selectedSports, setSelectedSports] = useState({
    Basketball: true,
    Football: true,
    Tennis: true,
  });

  const filteredBranches = branches?.filter(
    (branch) =>
      branch.venue.name.toLowerCase().includes(searchBarText.toLowerCase()) &&
      branch.courts
        .map((court) => selectedSports[court.courtType])
        .includes(true)
  );

  return (
    <AppHeader
      absolutePosition={false}
      title={"Courts"}
      backEnabled
      // left={
      //   <SportTypeDropdown
      //     selectedSports={selectedSports}
      //     setSelectedSports={setSelectedSports}
      //   />
      // }
    >
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
      <ScrollView contentContainerStyle={styles.wrapperView}>
        {isLoading && <BranchCardSkeleton type="horizontal" />}
        {!isLoading &&
          filteredBranches?.map((branch: Branch, index: number) => (
            <BranchCard
              key={index}
              type="horizontal"
              promoted={false}
              branch={branch}
            />
          ))}
        {!isLoading && (!filteredBranches || filteredBranches.length === 0) && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              There are no nearby branches.
            </Text>
          </View>
        )}
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
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
      marginHorizontal: 16,
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
