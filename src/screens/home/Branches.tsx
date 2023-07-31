import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { StyleSheet, ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import {
  AppHeader,
  SportTypeDropdown,
  BranchCard,
  BranchCardSkeleton,
} from "src/components";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "src/navigation";
import { useBranchesQuery } from "src/api";
import { useState } from "react";
import { Branch } from "src/types";

type Props = BottomTabScreenProps<BottomTabParamList>;

export const Branches = ({ navigation, route }: Props) => {
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
      title={"Venues"}
      left={
        <SportTypeDropdown
          selectedSports={selectedSports}
          setSelectedSports={setSelectedSports}
        />
      }
      searchBar
      searchBarText={searchBarText}
      setSearchBarText={setSearchBarText}
    >
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
              There are no nearby venues.
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
      padding: 20,
      paddingBottom: 40,
    },
    placeholder: {
      height: 50,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
    },
  });
