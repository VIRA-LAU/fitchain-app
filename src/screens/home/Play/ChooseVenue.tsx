import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader, VenueCard } from "src/components";
import IonIcon from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";
import { useBranchesQuery } from "src/api";
import { VenueBranch } from "src/types";

type Props = StackScreenProps<HomeStackParamList, "ChooseVenue">;

export const ChooseVenue = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { location, date: dateStr, duration, gameType } = route.params;
  const { data: branches } = useBranchesQuery();
  const date = new Date(JSON.parse(dateStr));

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Choose Venue"}
      backEnabled
    >
      <View style={styles.wrapperView}>
        <ScrollView style={styles.contentView}>
          <View style={styles.infoView}>
            <IonIcon name={"location-outline"} size={20} color={"white"} />
            <Text variant="labelLarge" style={styles.information}>
              {location}
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
          {branches?.map((venuesBranch: VenueBranch, index: number) => (
            <VenueCard
              key={index}
              type="horizontal"
              venueBranch={venuesBranch}
              promoted={false}
              isPlayScreen
              playScreenBookingDetails={{
                date: dateStr,
                duration,
                gameType,
              }}
            />
          ))}
        </ScrollView>
      </View>
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
      flexDirection: "row",
      alignItems: "center",
      margin: 20,
    },

    contentView: {},
  });
