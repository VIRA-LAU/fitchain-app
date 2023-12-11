import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  AppHeader,
  BranchCard,
  BranchCardSkeleton,
  HomeCard,
} from "components";
import { BottomTabParamList } from "src/navigation/tabScreenOptions";
import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import FeatherIcon from "react-native-vector-icons/Feather";
import { UserContext } from "src/utils";
import {
  useBranchesQuery,
  useInvitationsQuery,
  useReceivedRequestsQuery,
} from "src/api";
import { Branch } from "src/types";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "src/navigation";

type Props = BottomTabScreenProps<BottomTabParamList>;

const SectionTitle = ({ title }: { title: string }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 24,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          color: colors.tertiary,
          fontFamily: "Poppins-Bold",
          textTransform: "uppercase",
          fontSize: 16,
        }}
      >
        {title}
      </Text>
      <FeatherIcon name="chevron-right" color={colors.primary} size={20} />
    </View>
  );
};

export const Home = ({
  navigation,
  route,
  setPlayScreenVisible,
}: Props & { setPlayScreenVisible: Dispatch<SetStateAction<boolean>> }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { userData } = useContext(UserContext);

  const stackNavigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<StackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  const {
    data: branches,
    isFetching: branchesLoading,
    refetch: refetchBranches,
  } = useBranchesQuery();
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

  // const {
  //   data: games,
  //   isFetching: gamesLoading,
  //   refetch: refetchGames,
  // } = useGamesQuery({
  //   type: "upcoming",
  //   limit: 5,
  // });
  // const {
  //   data: bookings,
  //   isFetching: bookingsLoading,
  //   refetch: refetchBookings,
  // } = useBookingsQuery({
  //   type: "upcoming",
  // });
  // const {
  //   data: activities,
  //   isFetching: activitiesLoading,
  //   refetch: refetchActivities,
  // } = useActivitiesQuery(userData?.userId);

  // const [selectedSports, setSelectedSports] = useState({
  //   Basketball: true,
  //   Football: true,
  //   Tennis: true,
  // });
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (
      // !gamesLoading &&
      // !bookingsLoading &&
      !branchesLoading &&
      !requestsLoading &&
      !invitationsLoading
      // !activitiesLoading
    )
      setRefreshing(false);
  }, [
    // gamesLoading,
    // bookingsLoading,
    branchesLoading,
    requestsLoading,
    invitationsLoading,
    // activitiesLoading,
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // refetchGames();
    refetchInvitations();
    refetchRequests();
    // refetchBookings();
    refetchBranches();
    // refetchActivities();
  };

  // const filteredBranches = branches?.filter((branch) =>
  //   branch.courts.map((court) => selectedSports[court.courtType]).includes(true)
  // );

  return (
    <AppHeader
      absolutePosition={false}
      // left={
      //   <SportTypeDropdown
      //     selectedSports={selectedSports}
      //     setSelectedSports={setSelectedSports}
      //   />
      // }
      showLogo
      right={
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              width: 24,
              aspectRatio: 1,
            }}
            onPress={() => stackNavigation.push("Notifications")}
          >
            <Image
              source={require("assets/icons/notifications-dark.png")}
              style={{
                resizeMode: "contain",
                width: "100%",
                flex: 1,
              }}
            />
            {((invitations && invitations?.length > 0) ||
              (receivedRequests && receivedRequests?.length > 0)) && (
              <View
                style={{
                  height: 10,
                  width: 10,
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  position: "absolute",
                  right: 0,
                }}
              />
            )}
          </TouchableOpacity>
          {/* <Image
            source={require("assets/icons/chat-dark.png")}
            style={{
              resizeMode: "contain",
              width: 24,
              aspectRatio: 1,
              marginLeft: 16,
            }}
          /> */}
        </View>
      }
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
        <Text
          style={{
            color: colors.tertiary,
            marginBottom: 16,
            fontFamily: "Poppins-Bold",
            fontSize: 16,
          }}
        >
          Hi {userData?.firstName}, Welcome Back!
        </Text>
        <View style={{ flexDirection: "row" }}>
          <HomeCard
            type="book"
            title="Book a Court"
            body="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            addMarginRight
          />
          <HomeCard
            type="play"
            title="Play a Match"
            body="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />
        </View>
        <View style={{ flexDirection: "row", marginVertical: 16 }}>
          <HomeCard
            type="challenges"
            title="Challenges"
            body="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            addMarginRight
          />
          <HomeCard
            type="guide"
            title="Statistics Games"
            body="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />
        </View>
        <HomeCard
          type="leaderboard"
          title="Leaderboard"
          body="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />

        {/* <Text variant="labelLarge" style={styles.headerSubtext}>
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
        </View> */}

        {/* <SectionTitle title="Invitations" styles={styles} />
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
        </View> */}

        <SectionTitle title="Courts" />
        <View>
          <ScrollView
            style={{ flexDirection: "row", marginHorizontal: -20 }}
            contentContainerStyle={{ minWidth: "100%" }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {branchesLoading && <BranchCardSkeleton type="vertical" />}
            {!branchesLoading &&
              branches?.map((branch: Branch, index: number) => (
                <BranchCard
                  key={index}
                  type="vertical"
                  branch={branch}
                  isFirst={index === 0}
                  isLast={index === branches.length - 1}
                />
              ))}
          </ScrollView>
          {!branchesLoading &&
            (!branches ||
              (branches?.length === 0 && (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    There are no nearby venues.
                  </Text>
                </View>
              )))}
        </View>

        {/* <SectionTitle title="Bookings" styles={styles} />
        <View>
          {bookingsLoading && <BookingCardSkeleton />}
          {!bookingsLoading &&
            bookings
              ?.filter(({ type }: Game) => selectedSports[type])
              ?.slice(0, 5)
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
        </View> */}

        {/* <SectionTitle title="Activities" styles={styles} />
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
        </View> */}
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexGrow: 1,
      backgroundColor: colors.background,
      padding: 16,
      paddingBottom: 60,
    },
    headerSubtext: { color: colors.tertiary, marginTop: 10, marginBottom: 20 },
    placeholder: {
      height: 50,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      textAlign: "center",
    },
  });
