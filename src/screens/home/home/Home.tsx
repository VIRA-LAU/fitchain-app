import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native";
import { useContext, useEffect, useState } from "react";
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
import { HomeStackParamList } from "src/navigation";

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

export const Home = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { userData } = useContext(UserContext);

  const stackNavigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
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

  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (!branchesLoading && !requestsLoading && !invitationsLoading)
      setRefreshing(false);
  }, [branchesLoading, requestsLoading, invitationsLoading]);

  const onRefresh = () => {
    setRefreshing(true);
    refetchInvitations();
    refetchRequests();
    refetchBranches();
  };

  return (
    <AppHeader
      absolutePosition={false}
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
            title="Create a Game"
            body="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            addMarginRight
          />
          <HomeCard
            type="play"
            title="Game Cards"
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
            type="leaderboard"
            title="Leaderboard"
            body="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />
        </View>

        <SectionTitle title="Courts" />
        <View>
          <ScrollView
            style={{ flexDirection: "row", marginHorizontal: -16 }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              gap: 16,
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {branchesLoading && <BranchCardSkeleton type="vertical" />}
            {!branchesLoading &&
              branches?.map((branch: Branch, index: number) => (
                <BranchCard key={index} type="vertical" branch={branch} />
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
