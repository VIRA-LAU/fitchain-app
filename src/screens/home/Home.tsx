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
import { useVenuesQuery } from "src/api/queries";
import { useGamesQuery } from "src/api/queries/games/games-query";
import { useBookingsQuery } from "src/api/queries/games/bookings-query";
import { useInvitationsQuery } from "src/api/queries/games/invitations-query";
import { useActivitiesQuery } from "src/api/queries/games/activities-query";
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
  // const { data: venues } = useVenuesQuery();
  // const { data: games } = useGamesQuery(1);
  // const { data: bookings } = useBookingsQuery(1);
  // const { data: invitations } = useInvitationsQuery(1);
  // const { data: activities } = useActivitiesQuery(1);
  const games = [
    { date: new Date("2022-12-10"), location: "hoops", type: "tennis" },
  ];
  const invitations = [
    {
      friend: {
        firstName: "Jane",
        lastName: "Doe",
      },
      game: {
        type: "Basketball",
        date: new Date("2022-06-15T10:00:00.000Z"),
        duration: 30,
        court: {
          branch: {
            location: "New York",
          },
        },
      },
    },
  ];
  const venues = [
    {
      name: "ABC Sports Center",
      branches: [
        {
          location: "New York",
          rating: 0,
        },
      ],
    },
    {
      name: "XYZ Sports Club",
      branches: [
        {
          location: "Los Angeles",
          rating: 0,
        },
      ],
    },
  ];
  const bookings = [
    {
      date: new Date("2019-05-14T11:01:58.135Z"),
      duration: 30,
      type: "Basketball",
      court: {
        branch: {
          location: "New York",
          venue: {
            name: "ABC Sports Center",
          },
        },
      },
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
          {games.map((game: any) => (
            <UpcomingGameCard
              gameType={game.type}
              date={game.date}
              location={game.location}
            />
          ))}
        </View>

        <SectionTitle title="Invitations" styles={styles} />
        <ScrollView style={{ flexDirection: "row" }} horizontal>
          {invitations.map((invitation: any) => (
            <InvitationCard
              gameType={invitation.game.type.toLowerCase()}
              date={invitation.game.date}
              location={invitation.game.court.branch.location}
              inviter={
                invitation.friend.firstName + " " + invitation.friend.lastName
              }
            />
          ))}
        </ScrollView>
        <SectionTitle title="Venues" styles={styles} />
        <ScrollView style={{ flexDirection: "row" }} horizontal>
          {venues.map((venue: any) => (
            <VenueCard
              rating={venue.rating}
              name={venue.name}
              location={venue.location}
            />
          ))}
        </ScrollView>
        <SectionTitle title="Bookings" styles={styles} />
        <View>
          {bookings.map((booking: any) => (
            <BookingCard
              inviter={booking.inviter}
              location={booking.court.branch.location}
              gameType={booking.type.toLowerCase()}
              date={booking.date}
              gameDuration={booking.duration}
            />
          ))}
        </View>
        <SectionTitle title="Activities" styles={styles} />
        <View>
          {activities.map((activity: any) => (
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
