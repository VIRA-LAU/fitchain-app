import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { AppHeader, SportTypeDropdown, VenueCard } from "src/components";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useBranchesQuery } from "src/api";
import { useContext, useState } from "react";
import { UserContext } from "src/utils";
import { VenueBranch } from "src/types";

type Props = BottomTabScreenProps<BottomTabParamList>;

export const Venues = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { userData } = useContext(UserContext);
  const { data: branchesVenues } = useBranchesQuery();

  const [selectedSports, setSelectedSports] = useState({
    Basketball: true,
    Football: true,
    Tennis: true,
  });

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
    >
      <View style={styles.wrapperView}>
        {branchesVenues?.map((venuesBranch: VenueBranch, index: number) => (
          <VenueCard
            key={index}
            type="horizontal"
            promoted={false}
            venueBranch={venuesBranch}
          />
        ))}
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      margin: 20,
    },
  });
