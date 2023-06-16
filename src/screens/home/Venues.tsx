import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { StyleSheet, ScrollView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import {
  AppHeader,
  SportTypeDropdown,
  VenueCard,
  VenueCardSkeleton,
} from "src/components";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useBranchesQuery } from "src/api";
import { useState } from "react";
import { Branch } from "src/types";

type Props = BottomTabScreenProps<BottomTabParamList>;

export const Venues = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { data: venueBranches, isLoading } = useBranchesQuery();

  const [searchBarText, setSearchBarText] = useState<string>("");
  const [selectedSports, setSelectedSports] = useState({
    Basketball: true,
    Football: true,
    Tennis: true,
  });

  const filteredVenueBranches = venueBranches?.filter((venueBranch) =>
    venueBranch.venue.name.toLowerCase().includes(searchBarText.toLowerCase())
  );

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      right={<IonIcon name="ellipsis-horizontal" color="white" size={24} />}
      title={"Venues"}
      left={
        <SportTypeDropdown
          selectedSports={selectedSports}
          setSelectedSports={setSelectedSports}
        />
      }
      searchBar
      setSearchBarText={setSearchBarText}
    >
      <ScrollView contentContainerStyle={styles.wrapperView}>
        {isLoading && <VenueCardSkeleton type="horizontal" />}
        {!isLoading &&
          filteredVenueBranches?.map((venueBranch: Branch, index: number) => (
            <VenueCard
              key={index}
              type="horizontal"
              promoted={false}
              venueBranch={venueBranch}
            />
          ))}
        {!isLoading &&
          (!filteredVenueBranches || filteredVenueBranches.length === 0) && (
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
