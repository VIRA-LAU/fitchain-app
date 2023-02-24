import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { AppHeader, SportTypeDropdown, VenueCard } from "src/components";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";

type Props = BottomTabScreenProps<BottomTabParamList>;

export const Venues = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      right={<IonIcon name="ellipsis-horizontal" color="white" size={24} />}
      title={"Venues"}
      left={<SportTypeDropdown />}
      searchBar
    >
      <View style={styles.wrapperView}>
        <VenueCard type="focused" />
        <VenueCard type="horizontal" promoted={false} />
        <VenueCard type="horizontal" promoted={false} />
        <VenueCard type="horizontal" promoted={false} />
        <VenueCard type="horizontal" promoted={false} />
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
