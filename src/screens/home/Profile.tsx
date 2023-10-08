import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Pressable,
} from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  ActivityCard,
  ActivityCardSkeleton,
  AppHeader,
  GalleryPermissionDialog,
  SelectionModal,
  Skeleton,
  RadarChart,
} from "src/components";
import { BottomTabParamList, StackParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Activity } from "src/types";
import { useContext, useEffect, useState } from "react";
import { UserContext, uploadImage } from "src/utils";
import {
  useActivitiesQuery,
  useGameCountQuery,
  useUpdateUserMutation,
  useUserDetailsQuery,
} from "src/api";
import { StackScreenProps } from "@react-navigation/stack";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { TabBar, TabView } from "react-native-tab-view";

type Props =
  | BottomTabScreenProps<BottomTabParamList>
  | StackScreenProps<StackParamList, "PlayerProfile">;

export const Profile = ({
  navigation,
  route,
  isUserProfile = false,
}: Props & {
  isUserProfile?: boolean;
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const { width: windowWidth } = useWindowDimensions();
  const styles = makeStyles(colors, windowWidth);

  const { userData, setUserData } = useContext(UserContext);
  const { firstName, lastName, userId } = userData!;
  const { data: gameCount, isLoading: gameCountLoading } = useGameCountQuery(
    route.params?.playerId || userId
  );
  const { data: userDetails, isLoading: userDetailsLoading } =
    useUserDetailsQuery(route.params?.playerId || userId);
  const { data: activities, isLoading: activitiesLoading } = useActivitiesQuery(
    route.params?.playerId || userId
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhotoToUpload, setProfilePhotoToUpload] = useState<string>();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Timeline", title: "Timeline" },
    { key: "Stats", title: "Stats" },
    { key: "Teams", title: "Teams" },
  ]);

  const { mutate: updateUserData, isSuccess: updateUserSuccess } =
    useUpdateUserMutation();

  const renderScene = () => {
    const tabViewRoute = routes[index];
    switch (tabViewRoute.key) {
      case "Timeline":
        return (
          <View
            style={{ marginTop: 24, marginBottom: -10, marginHorizontal: 16 }}
          >
            {activitiesLoading && <ActivityCardSkeleton />}
            {!activitiesLoading &&
              activities?.map((activity: Activity, index: number) => (
                <ActivityCard key={index} {...activity} />
              ))}
            {!activitiesLoading && (!activities || activities.length === 0) && (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  {route.params?.firstName
                    ? `${route.params.firstName} has `
                    : "You have "}
                  no recent activities.
                </Text>
              </View>
            )}
          </View>
        );
      case "Stats":
        return (
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
            </View>
            <View style={{ flexDirection: "row" }}>
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
            </View>
          </View>
        );
      case "Teams":
        return (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 40,
            }}
          >
            <Text
              style={{ fontFamily: "Poppins-Regular", color: colors.tertiary }}
            >
              {isUserProfile ? "You are" : `${route.params?.firstName} is`} not
              part of any team yet.
            </Text>
          </View>
        );
      default:
        return <View />;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: "rgba(247, 126, 5, 0.1)",
        borderRadius: 100,
        elevation: 0,
        marginHorizontal: 16,
      }}
      renderTabBarItem={({ route }) => {
        let isActive = route.key === props.navigationState.routes[index].key;
        return (
          <Pressable
            key={route.key}
            style={({ pressed }) => [
              styles.tabViewItem,
              {
                backgroundColor: isActive ? colors.background : "transparent",
              },
              pressed && { backgroundColor: colors.background },
            ]}
            onPress={() => {
              setIndex(routes.findIndex(({ key }) => route.key === key));
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                color: colors.tertiary,
              }}
            >
              {route.title}
            </Text>
          </Pressable>
        );
      }}
      renderIndicator={() => <View style={{ width: 0 }} />}
    />
  );

  useEffect(() => {
    const handleBack = () => {
      if (isEditing) {
        setIsEditing(false);
        return true;
      } else return false;
    };
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, [isEditing]);

  return (
    <AppHeader
      right={
        isUserProfile && !userDetailsLoading ? (
          isEditing ? (
            <TouchableOpacity
              onPress={() => {
                setIsEditing(false);
                setModalVisible(false);
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
                setModalVisible(true);
              }}
            >
              <IonIcon name="menu-outline" color={colors.tertiary} size={28} />
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
      <ScrollView>
        <GalleryPermissionDialog
          visible={permissionDialogVisible}
          setVisible={setPermissionDialogVisible}
        />
        <SelectionModal
          visible={modalVisible}
          setVisible={setModalVisible}
          options={[
            {
              text: "Edit Profile",
              onPress: () => {
                setModalVisible(false);
                setIsEditing(true);
              },
            },
            {
              text: "Sign Out",
              onPress: () => {
                setModalVisible(false);
                setUserData(null);
              },
            },
          ]}
        />
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
                  labelStyle={{ fontFamily: "Poppins-Regular", fontSize: 60 }}
                  style={{
                    backgroundColor: colors.secondary,
                  }}
                  size={70}
                />
              )
            ) : (
              <View style={{ width: 70, aspectRatio: 1 }} />
            )}
            {isEditing && (
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
            height: 0.5 * windowWidth,
            width: "100%",
            alignSelf: "center",
            marginTop: 16,
            marginBottom: 24,
          }}
        >
          <RadarChart
            radarData={[
              { label: "Skill", value: 80 },
              { label: "Offense", value: 30 },
              { label: "Defense", value: 70 },
              { label: "General", value: 50 },
              { label: "Teamplay", value: 80 },
              { label: "Punctuality", value: 50 },
            ]}
            size={0.5 * windowWidth}
          />
        </View>
        <View style={styles.contentView}>
          <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabBar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: windowWidth }}
            swipeEnabled={false}
          />
        </View>
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors, windowWidth: number) =>
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
      marginBottom: 60,
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
      marginBottom: -10,
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
      flex: 1,
      height: 35,
      margin: 3,
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
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
