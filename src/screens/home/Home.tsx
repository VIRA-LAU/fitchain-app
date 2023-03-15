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
import { Activity, Game, Invitation, VenueBranch } from "src/types";
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
  const { data: games } = useGamesQuery({ type: "upcoming", limit: 5 });
  const { data: bookings } = useBookingsQuery();
  const { data: invitations } = useInvitationsQuery();
  const { data: activities } = useActivitiesQuery();

  const [selectedSports, setSelectedSports] = useState({
    Basketball: true,
    Football: true,
    Tennis: true,
  });

  const filteredBookings = bookings?.filter(({ type, date }: Game) => {
    const bookingDate = new Date(
      date.toISOString().substring(0, date.toISOString().indexOf("T"))
    );
    const todayDate = new Date(
      new Date()
        .toISOString()
        .substring(0, new Date().toISOString().indexOf("T"))
    );
    return (
      (bookingDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24) >=
        0 && selectedSports[type]
    );
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
            ?.filter(({ type }: Game) => selectedSports[type])
            .map((game: Game, index: number) => (
              <UpcomingGameCard key={index} game={game} />
            ))}
          {!games ||
            (games.length === 0 && (
              <Text style={styles.placeholderText}>
                You have no upcoming games.
              </Text>
            ))}
        </View>

        <SectionTitle title="Invitations" styles={styles} />
        <View>
          <ScrollView
            style={{
              flexDirection: "row",
              marginRight: -20,
            }}
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
          {!invitations ||
            (invitations.length === 0 && (
              <Text style={styles.placeholderText}>
                You have no pending invitations.
              </Text>
            ))}
        </View>
        <SectionTitle title="Venues" styles={styles} />
        <View>
          <ScrollView
            style={{ flexDirection: "row", marginRight: -20 }}
            horizontal
          >
            {branchesVenues?.map((venuesBranch: VenueBranch, index: number) => (
              <VenueCard
                key={index}
                type="vertical"
                venueBranch={venuesBranch}
              />
            ))}
          </ScrollView>
          {!branchesVenues ||
            (branchesVenues.length === 0 && (
              <Text style={styles.placeholderText}>
                There are no nearby venues.
              </Text>
            ))}
        </View>
        <SectionTitle title="Bookings" styles={styles} />
        <View>
          {filteredBookings?.map((booking: Game, index: number) => (
            <BookingCard key={index} booking={booking} />
          ))}
          {!filteredBookings ||
            (filteredBookings.length === 0 && (
              <Text style={styles.placeholderText}>
                There are no nearby bookings.
              </Text>
            ))}
        </View>
        <SectionTitle title="Activities" styles={styles} />
        <View>
          {activities
            ?.filter(({ type }) => selectedSports[type])
            .map((activity: Activity, index: number) => (
              <ActivityCard key={index} {...activity} />
            ))}
          {!activities ||
            (activities.length === 0 && (
              <Text style={styles.placeholderText}>
                You have no recent activities.
              </Text>
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
      marginBottom: 30,
    },
    headerSubtext: { color: colors.tertiary, marginTop: 10, marginBottom: 20 },
    sectionTitle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 30,
      marginBottom: 20,
    },
    placeholderText: {
      height: 50,
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
      textAlignVertical: "center",
      marginBottom: -10,
    },
  });
