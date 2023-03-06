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
  useGamesQuery,
  useBookingsQuery,
  useInvitationsQuery,
  useActivitiesQuery,
} from "src/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Activity, Booking, Invitation, VenueBranch } from "src/types";
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

  const { data: branchesVenues } = useBranchesQuery();
  const { data: games } = useGamesQuery();
  const { data: bookings } = useBookingsQuery();
  const { data: invitations } = useInvitationsQuery();
  const { data: activities } = useActivitiesQuery();

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
            ?.filter(({ type }: Booking) => selectedSports[type])
            .map((game: Booking, index: number) => (
              <UpcomingGameCard key={index} game={game} />
            ))}
        </View>

        <SectionTitle title="Invitations" styles={styles} />
        <ScrollView
          style={{ flexDirection: "row", marginRight: -20 }}
          horizontal
        >
          {invitations
            ?.filter(({ game }: Invitation) => selectedSports[game.type])
            .map((invitation: Invitation, index: number) => (
              <InvitationCard
                key={index}
                inviter={
                  invitation.user?.firstName + " " + invitation.user?.lastName
                }
                game={invitation.game}
              />
            ))}
        </ScrollView>
        <SectionTitle title="Venues" styles={styles} />
        <ScrollView
          style={{ flexDirection: "row", marginRight: -20 }}
          horizontal
        >
          {branchesVenues?.map((venuesBranch: VenueBranch, index: number) => (
            <VenueCard key={index} type="vertical" venueBranch={venuesBranch} />
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
                  0 && selectedSports[type]
              );
            })
            .map((booking: Booking, index: number) => (
              <BookingCard key={index} booking={booking} />
            ))}
        </View>
        <SectionTitle title="Activities" styles={styles} />
        <View>
          {activities
            ?.filter(({ type }) => selectedSports[type])
            .map((activity: Activity, index: number) => (
              <ActivityCard key={index} {...activity} />
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
