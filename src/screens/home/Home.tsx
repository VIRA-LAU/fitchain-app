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
import { useContext, useMemo, useState } from "react";
import {
  useBranchesQuery,
  useGamesQuery,
  useBookingsQuery,
  useInvitationsQuery,
  useActivitiesQuery,
  useReceivedRequestsQuery,
} from "src/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Activity,
  Game,
  GameRequest,
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

  const { data: branchesVenues } = useBranchesQuery();
  const { data: games } = useGamesQuery({ type: "upcoming", limit: 5 });
  const { data: bookings } = useBookingsQuery({ type: "upcoming" });
  const { data: invitations } = useInvitationsQuery();
  const { data: receivedRequests } = useReceivedRequestsQuery();
  const { data: activities } = useActivitiesQuery();

  const [selectedSports, setSelectedSports] = useState({
    Basketball: true,
    Football: true,
    Tennis: true,
  });

  const invitationsRequests = useMemo(() => {
    let result: ((Invitation | GameRequest) & {
      type: "invitation" | "request";
    })[] = [];
    if (invitations)
      result = result.concat(
        invitations.map((invitation) => ({ type: "invitation", ...invitation }))
      );
    if (receivedRequests)
      result = result.concat(
        receivedRequests.map((request) => ({ type: "request", ...request }))
      );

    const filtedResult = result.filter(
      ({ game }: Invitation) => selectedSports[game.type]
    );

    const sortedResult = result.sort(
      (a, b) => a.game.createdAt.getTime() - b.game.createdAt.getTime()
    );
    const mappedResult = filtedResult.map(
      (
        invReq: (Invitation | GameRequest) & {
          type: "invitation" | "request";
        },
        index: number
      ) => (
        <InvitationCard
          key={index}
          type={invReq.type}
          user={invReq.user?.firstName + " " + invReq.user?.lastName}
          game={invReq.game}
          isFirst={index === 0}
          isLast={index === filtedResult.length - 1}
        />
      )
    );
    return mappedResult;
  }, [JSON.stringify(invitations), JSON.stringify(receivedRequests)]);

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
            (games.filter(({ type }: Game) => selectedSports[type]).length ===
              0 && (
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
              marginHorizontal: -20,
            }}
            horizontal
          >
            {invitationsRequests}
          </ScrollView>
          {invitationsRequests.length === 0 && (
            <Text style={styles.placeholderText}>
              You have no pending invitations.
            </Text>
          )}
        </View>
        <SectionTitle title="Venues" styles={styles} />
        <View>
          <ScrollView
            style={{ flexDirection: "row", marginHorizontal: -20 }}
            horizontal
          >
            {branchesVenues?.map((venuesBranch: VenueBranch, index: number) => (
              <VenueCard
                key={index}
                type="vertical"
                venueBranch={venuesBranch}
                isFirst={index === 0}
                isLast={index === branchesVenues.length - 1}
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
          {bookings
            ?.filter(({ type }: Game) => selectedSports[type])
            .map((booking: Game, index: number) => (
              <BookingCard key={index} booking={booking} />
            ))}
          {!bookings ||
            (bookings.filter(({ type }: Game) => selectedSports[type])
              .length === 0 && (
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
            (activities.filter(({ type }) => selectedSports[type]).length ===
              0 && (
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
