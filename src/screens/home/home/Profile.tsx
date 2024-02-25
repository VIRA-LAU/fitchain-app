import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Avatar, Text, TouchableRipple, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  ActivityCard,
  ActivityCardSkeleton,
  AppHeader,
  GalleryPermissionDialog,
  Skeleton,
  RadarChart,
  DatePicker,
} from "src/components";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Activity } from "src/types";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { UserContext, uploadImage } from "src/utils";
import {
  useActivitiesQuery,
  useGameCountQuery,
  useUpdateUserMutation,
  useUserDetailsQuery,
} from "src/api";
import { StackScreenProps } from "@react-navigation/stack";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

type Props =
  | BottomTabScreenProps<BottomTabParamList>
  | StackScreenProps<HomeStackParamList, "PlayerProfile">;

export const Profile = ({
  navigation,
  route,
  isUserProfile = false,
  setProfileModalVisible,
  profileEditing,
  setProfileEditing,
}: Props & {
  isUserProfile?: boolean;
  setProfileModalVisible: Dispatch<SetStateAction<boolean>>;
  profileEditing: boolean;
  setProfileEditing: Dispatch<SetStateAction<boolean>>;
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(colors);

  const { userData, setUserData } = useContext(UserContext);
  const { firstName, lastName, userId } = userData!;

  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const [profilePhotoToUpload, setProfilePhotoToUpload] = useState<string>();
  const [activitiesDate, setActivitiesDate] = useState<Date>(new Date());

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "timeline", title: "Timeline" },
    { key: "stats", title: "Stats" },
    { key: "teams", title: "Teams" },
  ]);

  const { data: gameCount, isLoading: gameCountLoading } = useGameCountQuery(
    route.params?.playerId || userId
  );
  const { data: userDetails, isLoading: userDetailsLoading } =
    useUserDetailsQuery(route.params?.playerId || userId);
  const { data: activities, isLoading: activitiesLoading } = useActivitiesQuery(
    route.params?.playerId || userId
  );
  const filteredActivities = activities?.filter(
    (activity) =>
      activity.startTime
        .toISOString()
        .substring(0, activity.startTime.toISOString().indexOf("T")) ===
      activitiesDate
        .toISOString()
        .substring(0, activitiesDate.toISOString().indexOf("T"))
  );

  const { mutate: updateUserData, isSuccess: updateUserSuccess } =
    useUpdateUserMutation();

  const renderScene = SceneMap({
    timeline: () => (
      <View
        style={{
          flex: 1,
          marginBottom: -10,
          marginHorizontal: 16,
        }}
      >
        <View
          style={{
            marginHorizontal: 8,
            alignItems: "center",
          }}
        >
          <DatePicker
            currentDate={activitiesDate}
            setCurrentDate={setActivitiesDate}
          />
        </View>
        {activitiesLoading && <ActivityCardSkeleton />}
        {!activitiesLoading &&
          filteredActivities?.map((activity: Activity, index: number) => (
            <ActivityCard key={index} {...activity} />
          ))}
        {!activitiesLoading &&
          (!filteredActivities || filteredActivities.length === 0) && (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {route.params?.firstName
                  ? `${route.params.firstName} `
                  : "You "}
                didn't play on this date.
              </Text>
            </View>
          )}
      </View>
    ),
    stats: () => (
      <View style={{ marginTop: 24, marginHorizontal: 30 }}>
        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          <View
            style={{
              flex: 1,
              borderRightWidth: 1,
              borderColor: colors.primary,
            }}
          >
            <Text style={styles.statsTitle}>RPG</Text>
            <Text style={styles.statsValue}>31.4</Text>
          </View>
          <View
            style={{
              flex: 1.25,
              borderRightWidth: 1,
              borderColor: colors.primary,
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.statsTitle}>3 PTS</Text>
              <Text style={styles.statsValue}>28.9</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
            }}
          >
            <View>
              <Text style={styles.statsTitle}>2 PTS</Text>
              <Text style={styles.statsValue}>38.1</Text>
            </View>
          </View>
        </View>
        {/* <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  borderRightWidth: 1,
                  borderColor: colors.primary,
                }}
              >
                <Text style={styles.statsTitle}>RPG</Text>
                <Text style={styles.statsValue}>28.9</Text>
              </View>
              <View
                style={{
                  flex: 1.25,
                  borderRightWidth: 1,
                  borderColor: colors.primary,
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={styles.statsTitle}>3 PTS</Text>
                  <Text style={styles.statsValue}>28.9</Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                }}
              >
                <View>
                  <Text style={styles.statsTitle}>2 PTS</Text>
                  <Text style={styles.statsValue}>28.9</Text>
                </View>
              </View> 
            </View>*/}
      </View>
    ),
    teams: () => (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 40,
        }}
      >
        <Text style={{ fontFamily: "Poppins-Regular", color: colors.tertiary }}>
          {isUserProfile ? "You are" : `${route.params?.firstName} is`} not part
          of any team yet.
        </Text>
      </View>
    ),
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: "rgba(247, 126, 5, 0.1)",
        borderRadius: 100,
        elevation: 0,
        marginHorizontal: 16,
      }}
      contentContainerStyle={{ gap: 3 }}
      renderTabBarItem={({ route }) => {
        let isActive = route.key === props.navigationState.routes[index].key;
        return (
          <TouchableRipple
            key={route.key}
            borderless
            style={{
              borderRadius: 100,
            }}
            onPress={() => {
              setIndex(routes.findIndex(({ key }) => route.key === key));
            }}
          >
            <View
              style={[
                styles.tabViewItem,
                {
                  backgroundColor: isActive ? colors.primary : "transparent",
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  color: isActive ? colors.background : colors.tertiary,
                }}
              >
                {route.title}
              </Text>
            </View>
          </TouchableRipple>
        );
      }}
      renderIndicator={() => <View style={{ width: 0 }} />}
    />
  );

  return (
    <Fragment>
      <AppHeader
        right={
          isUserProfile && !userDetailsLoading ? (
            profileEditing ? (
              <TouchableOpacity
                onPress={() => {
                  setProfileEditing(false);
                  setProfileModalVisible(false);
                }}
              >
                <IonIcon
                  name="checkmark-sharp"
                  color={colors.primary}
                  size={24}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setProfileModalVisible(true);
                }}
              >
                <IonIcon
                  name="menu-outline"
                  color={colors.tertiary}
                  size={28}
                />
              </TouchableOpacity>
            )
          ) : (
            <View />
          )
        }
        title={"Profile"}
        absolutePosition={false}
        backEnabled={!isUserProfile}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}>
          <View style={styles.headerContent}>
            <View>
              {!userDetailsLoading ? (
                profilePhotoToUpload ? (
                  <Avatar.Image
                    source={{ uri: profilePhotoToUpload }}
                    size={70}
                    style={{ backgroundColor: "transparent" }}
                  />
                ) : userDetails?.profilePhotoUrl ? (
                  <Avatar.Image
                    source={{ uri: userDetails.profilePhotoUrl }}
                    size={70}
                    style={{ backgroundColor: "transparent" }}
                  />
                ) : (
                  <Avatar.Text
                    label={
                      userDetails?.firstName
                        ? `${userDetails?.firstName.charAt(
                            0
                          )}${userDetails?.lastName.charAt(0)}`
                        : ""
                    }
                    labelStyle={{ fontFamily: "Poppins-Regular", fontSize: 30 }}
                    style={{
                      backgroundColor: colors.secondary,
                    }}
                    size={70}
                  />
                )
              ) : (
                <View style={{ width: 70, aspectRatio: 1 }} />
              )}
              {profileEditing && (
                <TouchableOpacity
                  onPress={() =>
                    uploadImage(
                      "user",
                      "profile",
                      userData?.userId,
                      setPermissionDialogVisible,
                      setProfilePhotoToUpload,
                      updateUserData
                    )
                  }
                  activeOpacity={0.8}
                  style={[
                    styles.editImage,
                    {
                      borderRadius: 100,
                    },
                  ]}
                >
                  <MaterialIcon
                    name="camera-alt"
                    size={28}
                    color={colors.tertiary}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View>
              {userDetailsLoading ? (
                <Skeleton height={20} width={150} style={styles.name} />
              ) : (
                userDetails?.firstName && (
                  <Text style={styles.name}>{`${
                    userDetails?.firstName || firstName
                  } ${userDetails?.lastName || lastName}`}</Text>
                )
              )}
              {gameCountLoading ? (
                <Skeleton height={15} width={100} style={styles.gameCount} />
              ) : (
                <Text style={styles.gameCount}>
                  Played {gameCount} game{gameCount !== 1 && "s"}
                </Text>
              )}
            </View>
          </View>
          {userDetailsLoading ? (
            <Skeleton height={20} width={150} style={styles.bio} />
          ) : (
            userDetails?.description && (
              <Text style={styles.bio}>{userDetails?.description}</Text>
            )
          )}
          <View style={styles.divider} />
          <View
            style={{
              height: 0.5 * Dimensions.get("screen").width,
              width: "100%",
              alignSelf: "center",
              marginTop: 16,
              marginBottom: 24,
            }}
          >
            <RadarChart
              radarData={
                userDetails
                  ? [
                      {
                        label: "Skill",
                        value: (userDetails.skill * 100) / 5,
                      },
                      {
                        label: "Offense",
                        value: (userDetails.offense * 100) / 5,
                      },
                      {
                        label: "Defense",
                        value: (userDetails.defense * 100) / 5,
                      },
                      {
                        label: "General",
                        value: (userDetails.general * 100) / 5,
                      },
                      {
                        label: "Teamplay",
                        value: (userDetails.teamplay * 100) / 5,
                      },
                      {
                        label: "Punctuality",
                        value: (userDetails.punctuality * 100) / 5,
                      },
                    ]
                  : [
                      { label: "Skill", value: 0 },
                      { label: "Offense", value: 0 },
                      { label: "Defense", value: 0 },
                      { label: "General", value: 0 },
                      { label: "Teamplay", value: 0 },
                      { label: "Punctuality", value: 0 },
                    ]
              }
              size={0.5 * Dimensions.get("screen").width}
            />
          </View>

          <View style={styles.contentView}>
            <TabView
              navigationState={{ index, routes }}
              renderTabBar={renderTabBar}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: Dimensions.get("screen").width }}
              swipeEnabled={false}
            />
          </View>
        </ScrollView>
      </AppHeader>
      <GalleryPermissionDialog
        visible={permissionDialogVisible}
        setVisible={setPermissionDialogVisible}
      />
    </Fragment>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    headerContent: {
      alignItems: "center",
      flexDirection: "row",
      marginHorizontal: 16,
      marginVertical: 24,
    },
    name: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
      fontSize: 24,
      marginLeft: 16,
    },
    gameCount: {
      fontFamily: "Poppins-Medium",
      color: "#979797",
      marginLeft: 16,
    },
    bio: {
      fontFamily: "Poppins-Medium",
      color: colors.tertiary,
      fontSize: 12,
      marginBottom: 16,
      marginHorizontal: 20,
    },
    contentView: {
      flexGrow: 1,
      minHeight: 300,
    },
    teamsView: {
      flexDirection: "row",
      alignItems: "center",
    },
    divider: {
      borderColor: colors.secondary,
      borderBottomWidth: 1,
    },
    placeholder: {
      height: 50,
      justifyContent: "center",
      marginBottom: 30,
    },
    placeholderText: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      textAlign: "center",
    },
    editImage: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      top: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    tabViewItem: {
      height: 35,
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
      width: (Dimensions.get("screen").width - 32 - 6) / 3,
    },
    statsTitle: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
    statsValue: {
      fontFamily: "Poppins-Bold",
      color: colors.primary,
      fontSize: 24,
    },
  });
