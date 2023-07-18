import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { useContext, useEffect, useMemo, useState } from "react";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  AppHeader,
  UpcomingGameCard,
  ActivityCard,
  BookingCard,
  InvitationCard,
  BranchCard,
  SportTypeDropdown,
  BookingCardSkeleton,
  UpcomingGameCardSkeleton,
  BranchCardSkeleton,
  InvitationCardSkeleton,
  ActivityCardSkeleton,
} from "components";
import { BottomTabParamList } from "src/navigation/tabScreenOptions";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import FeatherIcon from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";
import { UserContext } from "src/utils";
import {
  useBranchesQuery,
  useGamesQuery,
  useBookingsQuery,
  useInvitationsQuery,
  useActivitiesQuery,
  useReceivedRequestsQuery,
} from "src/api";
import { Activity, Game, GameRequest, Invitation, Branch } from "src/types";

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

  const {
    data: branches,
    isFetching: branchesLoading,
    refetch: refetchBranches,
  } = useBranchesQuery();
  const {
    data: games,
    isFetching: gamesLoading,
    refetch: refetchGames,
  } = useGamesQuery({
    type: "upcoming",
    limit: 5,
  });
  const {
    data: bookings,
    isFetching: bookingsLoading,
    refetch: refetchBookings,
  } = useBookingsQuery({
    type: "upcoming",
  });
  const {
    data: invitations,
    isFetching: invitationsLoading,
    refetch: refetchInvitations,
  } = useInvitationsQuery();
  const {
    data: receivedRequests,
    isFetching: requestsLoading,
    refetch: refetchRequests,
  } = useReceivedRequestsQuery();
  const {
    data: activities,
    isFetching: activitiesLoading,
    refetch: refetchActivities,
  } = useActivitiesQuery(userData?.userId);

  const [selectedSports, setSelectedSports] = useState({
    Basketball: true,
    Football: true,
    Tennis: true,
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);

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

    const filteredResult = result.filter(
      ({ game }: Invitation) => selectedSports[game.type]
    );

    const sortedResult = result.sort(
      (a, b) => a.game.createdAt.getTime() - b.game.createdAt.getTime()
    );
    const mappedResult = sortedResult.map(
      (
        invReq: (Invitation | GameRequest) & {
          type: "invitation" | "request";
        },
        index: number
      ) => (
        <InvitationCard
          id={invReq.id}
          key={index}
          type={invReq.type}
          user={invReq.user?.firstName + " " + invReq.user?.lastName}
          game={invReq.game}
          isFirst={index === 0}
          isLast={index === filteredResult.length - 1}
          profilePhotoUrl={invReq.user?.profilePhotoUrl}
        />
      )
    );
    return mappedResult;
  }, [
    JSON.stringify(invitations),
    JSON.stringify(receivedRequests),
    JSON.stringify(selectedSports),
  ]);

  useEffect(() => {
    if (
      !gamesLoading &&
      !bookingsLoading &&
      !branchesLoading &&
      !requestsLoading &&
      !invitationsLoading &&
      !activitiesLoading
    )
      setRefreshing(false);
  }, [
    gamesLoading,
    bookingsLoading,
    branchesLoading,
    requestsLoading,
    invitationsLoading,
    activitiesLoading,
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    refetchGames();
    refetchInvitations();
    refetchRequests();
    refetchBookings();
    refetchBranches();
    refetchActivities();
  };

  const filteredBranches = branches?.filter((branch) =>
    branch.courts.map((court) => selectedSports[court.courtType]).includes(true)
  );

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
      <ScrollView
        contentContainerStyle={styles.wrapperView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            progressBackgroundColor={colors.secondary}
          />
        }
      >
        <Text variant="headlineSmall" style={{ color: "white" }}>
          Hi {userData?.firstName},
        </Text>
        <Text variant="labelLarge" style={styles.headerSubtext}>
          Upcoming Games
        </Text>
        <View>
          {gamesLoading && <UpcomingGameCardSkeleton />}
          {!gamesLoading &&
            games
              ?.filter(({ type }: Game) => selectedSports[type])
              .map((game: Game, index: number) => (
                <UpcomingGameCard key={index} game={game} />
              ))}
          {!gamesLoading &&
            (!games ||
              (games.filter(({ type }: Game) => selectedSports[type]).length ===
                0 && (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    You have no upcoming games.
                  </Text>
                </View>
              )))}
        </View>

        <SectionTitle title="Invitations" styles={styles} />
        <View>
          <ScrollView
            style={{
              flexDirection: "row",
              marginHorizontal: -20,
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {(invitationsLoading || requestsLoading) && (
              <InvitationCardSkeleton />
            )}
            {!invitationsLoading && !requestsLoading && invitationsRequests}
          </ScrollView>
          {!invitationsLoading &&
            !requestsLoading &&
            invitationsRequests.length === 0 && (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  You have no pending invitations.
                </Text>
              </View>
            )}
        </View>
        <SectionTitle title="Venues" styles={styles} />
        <View>
          <ScrollView
            style={{ flexDirection: "row", marginHorizontal: -20 }}
            contentContainerStyle={{ minWidth: "100%" }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {branchesLoading && <BranchCardSkeleton type="vertical" />}
            {!branchesLoading &&
              filteredBranches?.map((branch: Branch, index: number) => (
                <BranchCard
                  key={index}
                  type="vertical"
                  branch={branch}
                  isFirst={index === 0}
                  isLast={index === filteredBranches.length - 1}
                />
              ))}
          </ScrollView>
          {!branchesLoading &&
            (!filteredBranches ||
              (filteredBranches?.length === 0 && (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    There are no nearby venues.
                  </Text>
                </View>
              )))}
        </View>
        <SectionTitle title="Bookings" styles={styles} />
        <View>
          {bookingsLoading && <BookingCardSkeleton />}
          {!bookingsLoading &&
            bookings
              ?.filter(({ type }: Game) => selectedSports[type])
              .map((booking: Game, index: number) => (
                <BookingCard key={index} booking={booking} isPrevious={false} />
              ))}
          {!bookingsLoading &&
            (!bookings ||
              (bookings.filter(({ type }: Game) => selectedSports[type])
                .length === 0 && (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    There are no nearby bookings.
                  </Text>
                </View>
              )))}
        </View>
        <SectionTitle title="Activities" styles={styles} />
        <View>
          {activitiesLoading && <ActivityCardSkeleton />}
          {!activitiesLoading &&
            activities
              ?.filter(({ type }) => selectedSports[type])
              .map((activity: Activity, index: number) => (
                <ActivityCard key={index} {...activity} />
              ))}
          {!activitiesLoading &&
            (!activities ||
              activities.filter(({ type }) => selectedSports[type]).length ===
                0) && (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  You have no recent activities.
                </Text>
              </View>
            )}
        </View>
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexGrow: 1,
      backgroundColor: colors.background,
      padding: 20,
      paddingBottom: 40,
    },
    headerSubtext: { color: colors.tertiary, marginTop: 10, marginBottom: 20 },
    sectionTitle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 30,
      marginBottom: 20,
    },
    placeholder: {
      height: 50,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
    },
  });
