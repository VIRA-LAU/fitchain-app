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
import { useContext, useState } from "react";
import {
  useBranchesQuery,
  useVenuesQuery,
  useGamesQuery,
  useBookingsQuery,
  useInvitationsQuery,
  useActivitiesQuery,
} from "src/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Activity,
  Booking,
  GameType,
  Invitation,
  VenueBranch,
} from "src/types";
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
  const { userData } = useContext(UserContext);

  const { data: branchesVenues } = useBranchesQuery(userData!);
  const { data: games } = useGamesQuery(userData!);
  const { data: bookings } = useBookingsQuery(userData!);
  const { data: invitations } = useInvitationsQuery(userData!);
  // const { data: activities } = useActivitiesQuery(1);
  const activities: Activity[] = [
    { date: new Date("2022-12-12T10:10:15"), gameType: "basketball" },
  ];

  const [selectedSports, setSelectedSports] = useState({
    basketball: true,
    football: true,
    tennis: true,
  });

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      right={<IonIcon name="notifications-outline" color="white" size={24} />}
      left={
        <SportTypeDropdown
          selectedSports={selectedSports}
          setSelectedSports={setSelectedSports}
        />
      }
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
          {games
            ?.filter(
              ({ type }: Booking) =>
                selectedSports[type.toLowerCase() as GameType]
            )
            .map((game: Booking, index: number) => (
              <UpcomingGameCard
                key={index}
                gameType={game.type.toLowerCase() as GameType}
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
          {invitations
            ?.filter(
              ({ game }: Invitation) =>
                selectedSports[game.type.toLowerCase() as GameType]
            )
            .map((invitation: Invitation, index: number) => (
              <InvitationCard
                key={index}
                gameType={invitation.game.type.toLowerCase() as GameType}
                date={invitation.game.date}
                location={invitation.game.court.branch.location}
                inviter={
                  invitation.user?.firstName + " " + invitation.user?.lastName
                }
              />
            ))}
        </ScrollView>
        <SectionTitle title="Venues" styles={styles} />
        <ScrollView
          style={{ flexDirection: "row", marginRight: -20 }}
          horizontal
        >
          {branchesVenues?.map((venuesBranch: VenueBranch, index: number) => (
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
          {bookings
            ?.filter(({ type, date }: Booking) => {
              const bookingDate = new Date(
                date.toISOString().substring(0, date.toISOString().indexOf("T"))
              );
              const todayDate = new Date(
                new Date()
                  .toISOString()
                  .substring(0, new Date().toISOString().indexOf("T"))
              );
              return (
                (bookingDate.getTime() - todayDate.getTime()) /
                  (1000 * 60 * 60 * 24) >=
                  0 && selectedSports[type.toLowerCase() as GameType]
              );
            })
            .map((booking: Booking, index: number) => (
              <BookingCard
                key={index}
                inviter={
                  booking.admin?.firstName + " " + booking.admin?.lastName
                }
                location={booking.court.branch.location}
                gameType={booking.type.toLowerCase() as GameType}
                date={booking.date}
                gameDuration={booking.duration}
              />
            ))}
        </View>
        <SectionTitle title="Activities" styles={styles} />
        <View>
          {activities.map((activity: Activity, index: number) => (
            <ActivityCard
              key={index}
              date={activity.date}
              gameType={activity.gameType}
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
