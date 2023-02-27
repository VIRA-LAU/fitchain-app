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
import { UserContext, UserData } from "src/utils";
import { useContext } from "react";
import { useBranchesQuery, useVenuesQuery } from "src/api/queries";
import { useGamesQuery } from "src/api/queries/games/games-query";
import { useBookingsQuery } from "src/api/queries/games/bookings-query";
import { useInvitationsQuery } from "src/api/queries/games/invitations-query";
import { useActivitiesQuery } from "src/api/queries/games/activities-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const { userData }: any = useContext(UserContext);

  const { data: branchesVenues } = useBranchesQuery(userData);
  const { data: games } = useGamesQuery(userData);
  const { data: bookings } = useBookingsQuery(userData);
  const { data: invitations } = useInvitationsQuery(userData);
  // const { data: activities } = useActivitiesQuery(1);
  const activities = [
    { date: new Date("2022-12-12T10:10:15"), type: "basketball" },
  ];
  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      right={<IonIcon name="notifications-outline" color="white" size={24} />}
      left={<SportTypeDropdown />}
      showLogo
    >
      <View style={styles.wrapperView}>
        <Text variant="headlineSmall" style={{ color: "white" }}>
          Hi {userData?.firstName},
        </Text>
        <Text variant="labelLarge" style={styles.headerSubtext}>
          Upcoming Games
        </Text>
        <View>
          {games?.map((game: any, index: number) => (
            <UpcomingGameCard
              key={index}
              gameType={game.type.toLowerCase()}
              date={game.date}
              location={
                game.court.branch.venue.name +
                " - " +
                game.court.branch.location
              }
            />
          ))}
        </View>

        <SectionTitle title="Invitations" styles={styles} />
        <ScrollView
          style={{ flexDirection: "row", marginRight: -20 }}
          horizontal
        >
          {invitations?.map((invitation: any, index: number) => (
            <InvitationCard
              key={index}
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
        <ScrollView
          style={{ flexDirection: "row", marginRight: -20 }}
          horizontal
        >
          {branchesVenues?.map((venuesBranch: any, index: number) => (
            <VenueCard
              key={index}
              type="vertical"
              rating={venuesBranch.rating}
              name={venuesBranch.venue.name}
              location={venuesBranch.location}
            />
          ))}
        </ScrollView>
        <SectionTitle title="Bookings" styles={styles} />
        <View>
          {bookings?.map((booking: any, index: number) => (
            <BookingCard
              key={index}
              inviter={booking.admin?.firstName + " " + booking.admin?.lastName}
              location={booking.court.branch.location}
              gameType={booking.type.toLowerCase()}
              date={booking.date}
              gameDuration={booking.duration}
            />
          ))}
        </View>
        <SectionTitle title="Activities" styles={styles} />
        <View>
          {activities.map((activity: any, index: number) => (
            <ActivityCard
              key={index}
              date={activity.date}
              gameType={activity.type}
            />
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
  });
