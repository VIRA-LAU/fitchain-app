import { StyleSheet, View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  AppHeader,
  UpcomingGameCard,
  ActivityCard,
  BookingCard,
  InvitationCard,
  VenueCard,
  SportTypeDropdown,
} from "components";
import { BottomTabParamList } from "src/navigation/tabScreenOptions";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import FeatherIcon from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";
import { UserContext } from "src/utils";
import { useContext } from "react";
type Props = BottomTabScreenProps<BottomTabParamList>;

const SectionTitle = ({ title, styles }: { title: string; styles: any }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionTitle}>
      <Text variant="labelLarge" style={{ color: colors.tertiary }}>
        {title}
      </Text>
      <FeatherIcon name="chevron-right" color={colors.tertiary} size={20} />
    </View>
  );
};

export const Home = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { userId, firstName, lastName } = useContext(UserContext);
  const games = [
    { date: new Date("2022-12-10"), location: "hoops", type: "tennis" },
  ];
  const invitations = [
    {
      date: new Date("2022-12-12T10:10:15"),
      location: "hoops",
      type: "basketball",
      inviter: "Alain H.",
    },
  ];
  const venues = [
    {
      location: "hoops - Forn el chebbak",
      name: "Basketball Hub",
      rating: "2.6",
    },
  ];
  const bookings = [
    {
      type: "basketball",
      inviter: "Alain H.",
      location: "Hoops - Furn el chebbak",
      date: new Date("2022-12-12T10:10:15"),
      gameDuration: 45,
    },
  ];
  const activities = [
    { date: new Date("2022-12-12T10:10:15"), type: "basketball" },
  ];
  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      right={<IonIcon name="notifications-outline" color="white" size={24} />}
      left={
        <View style={styles.dropdownView}>
          <SportTypeDropdown></SportTypeDropdown>
        </View>
      }
      showLogo
    >
      <View style={styles.wrapperView}>
        <Text variant="headlineSmall" style={{ color: "white" }}>
          Hi {firstName},
        </Text>
        <Text variant="labelLarge" style={styles.headerSubtext}>
          Upcoming Games
        </Text>
        <View>
          {games.map((game) => (
            <UpcomingGameCard
              gameType={game.type}
              date={game.date}
              location={game.location}
            />
          ))}
        </View>

        <SectionTitle title="Invitations" styles={styles} />
        <ScrollView style={{ flexDirection: "row" }} horizontal>
          {invitations.map((invitation) => (
            <InvitationCard
              gameType={invitation.type}
              date={invitation.date}
              location={invitation.location}
            />
          ))}
        </ScrollView>
        <SectionTitle title="Venues" styles={styles} />
        <ScrollView style={{ flexDirection: "row" }} horizontal>
          {venues.map((venue) => (
            <VenueCard
              rating={venue.rating}
              name={venue.name}
              location={venue.location}
            />
          ))}
        </ScrollView>
        <SectionTitle title="Bookings" styles={styles} />
        <View>
          {bookings.map((booking) => (
            <BookingCard
              inviter={booking.inviter}
              location={booking.location}
              gameType={booking.type}
              date={booking.date}
              gameDuration={booking.gameDuration}
            />
          ))}
        </View>
        <SectionTitle title="Activities" styles={styles} />
        <View>
          {activities.map((activity) => (
            <ActivityCard date={activity.date} gameType={activity.type} />
          ))}
        </View>
      </View>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    headerSubtext: { color: colors.tertiary, marginTop: 10, marginBottom: 20 },
    sectionTitle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 30,
      marginBottom: 20,
    },
    dropdownView: {
      height: 20,
      width: 20,
      // paddingTop: -10,
      // paddingLeft: 25,
    },
  });
