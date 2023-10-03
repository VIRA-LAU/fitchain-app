import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  BackHandler,
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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const styles = makeStyles(colors, windowWidth, windowHeight);

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
  const [coverPhotoToUpload, setCoverPhotoToUpload] = useState<string>();
  const [profilePhotoToUpload, setProfilePhotoToUpload] = useState<string>();

  const { mutate: updateUserData, isSuccess: updateUserSuccess } =
    useUpdateUserMutation();

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
        {/* <View>
            {!userDetailsLoading ? (
              <Image
                source={
                  coverPhotoToUpload
                    ? { uri: coverPhotoToUpload }
                    : userDetails?.coverPhotoUrl
                    ? {
                        uri: userDetails.coverPhotoUrl,
                      }
                    : require("assets/images/home/profile-background.png")
                }
                style={styles.headerImage}
              />
            ) : (
              <View
                style={[
                  styles.headerImage,
                  { backgroundColor: colors.background },
                ]}
              />
            )}
            {isEditing && (
              <TouchableOpacity
                onPress={() =>
                  uploadImage(
                    "user",
                    "cover",
                    userData?.userId,
                    setPermissionDialogVisible,
                    setCoverPhotoToUpload,
                    updateUserData
                  )
                }
                activeOpacity={0.8}
                style={[
                  styles.editImage,
                  {
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  },
                ]}
              >
                <MaterialIcon
                  name="image"
                  size={28}
                  color={colors.tertiary}
                  style={{ marginRight: 20, marginBottom: 20 }}
                />
              </TouchableOpacity>
            )}
          </View> */}
        <View style={styles.headerContent}>
          <View
            style={{
              // marginTop: (-0.33 * windowWidth) / 2,
              marginTop: 24,
            }}
          >
            {!userDetailsLoading ? (
              profilePhotoToUpload ? (
                <Avatar.Image
                  source={{ uri: profilePhotoToUpload }}
                  size={0.33 * windowWidth}
                  style={{ backgroundColor: "transparent" }}
                />
              ) : userDetails?.profilePhotoUrl ? (
                <Avatar.Image
                  source={{ uri: userDetails.profilePhotoUrl }}
                  size={0.33 * windowWidth}
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
                  size={0.33 * windowWidth}
                />
              )
            ) : (
              <View style={{ width: 0.33 * windowWidth, aspectRatio: 1 }} />
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
            <Skeleton height={15} width={100} style={styles.headerText1} />
          ) : (
            <Text style={styles.headerText1}>
              Played {gameCount} game{gameCount !== 1 && "s"}
            </Text>
          )}
          {userDetailsLoading ? (
            <Skeleton height={20} width={150} style={styles.headerText2} />
          ) : (
            userDetails?.description && (
              <Text style={styles.headerText2}>{userDetails?.description}</Text>
            )
          )}
        </View>
        <View style={styles.contentView}>
          <Text variant="labelLarge" style={{ color: colors.tertiary }}>
            Rating
          </Text>
          <View style={styles.teamsView}>
            {userDetailsLoading ? (
              <Skeleton height={60} width={90} />
            ) : (
              <Text style={styles.rating}>
                {userDetails?.rating.toFixed(1)}
              </Text>
            )}
            <View style={styles.ratingLabelsView}>
              <Text style={styles.ratingLabel}>PERFORMANCE</Text>
              <Text style={styles.ratingLabel}>PUNCTUALITY</Text>
              <Text style={styles.ratingLabel}>TEAMPLAYER</Text>
              <Text style={styles.ratingLabel}>FAIR PLAY</Text>
            </View>
            <View style={styles.ratingLinesView}>
              <View style={styles.ratingLineOuter}>
                <View
                  style={[
                    styles.ratingLineInner,
                    {
                      width: `${(userDetails?.performance
                        ? userDetails.performance * 20
                        : 0
                      ).toFixed(1)}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.ratingLineOuter}>
                <View
                  style={[
                    styles.ratingLineInner,
                    {
                      width: `${(userDetails?.punctuality
                        ? userDetails.punctuality * 20
                        : 0
                      ).toFixed(1)}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.ratingLineOuter}>
                <View
                  style={[
                    styles.ratingLineInner,
                    {
                      width: `${(userDetails?.teamPlayer
                        ? userDetails.teamPlayer * 20
                        : 0
                      ).toFixed(1)}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.ratingLineOuter}>
                <View
                  style={[
                    styles.ratingLineInner,
                    {
                      width: `${(userDetails?.fairplay
                        ? userDetails.fairplay * 20
                        : 0
                      ).toFixed(1)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <Text
            variant="labelLarge"
            style={{ color: colors.tertiary, marginTop: 20 }}
          >
            Achievements (3)
          </Text>
          <View style={styles.achievementsView}>
            <View style={styles.achievementView}>
              <Image
                source={require("assets/images/home/achievement-mvp.png")}
                style={styles.achievement}
              />
              <Text style={styles.achievementTitle}>MVP</Text>
              <Text style={styles.achievementValue}>x3</Text>
            </View>
            <View style={styles.achievementView}>
              <Image
                source={require("assets/images/home/achievement-top-scorer.png")}
                style={styles.achievement}
              />
              <Text style={styles.achievementTitle}>Top Scorer</Text>
              <Text style={styles.achievementValue}>x11</Text>
            </View>
            <View style={styles.achievementView}>
              <Image
                source={require("assets/images/home/achievement-3-pointer.png")}
                style={styles.achievement}
              />
              <Text style={styles.achievementTitle}>3-Pointer</Text>
              <Text style={styles.achievementValue}>x3</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text
            variant="labelLarge"
            style={{ color: colors.tertiary, marginVertical: 20 }}
          >
            Activity
          </Text>
          <View>
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
        </View>
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (
  colors: MD3Colors,
  windowWidth: number,
  windowHeight: number
) =>
  StyleSheet.create({
    headerImage: {
      width: "100%",
      height: 0.25 * windowHeight,
      opacity: 0.5,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    headerContent: {
      alignItems: "center",
    },
    buttonsView: {
      flexDirection: "row",
      margin: 15,
      justifyContent: "space-between",
      alignItems: "center",
    },
    name: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
      fontSize: 24,
      marginTop: 16,
      marginBottom: 12,
    },
    headerText1: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
    },
    headerText2: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
      marginBottom: 16,
      textAlign: "center",
      marginTop: 5,
    },
    contentView: {
      padding: 20,
      marginBottom: 30,
    },
    teamsView: {
      flexDirection: "row",
      alignItems: "center",
    },
    rating: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
      fontSize: 70,
      lineHeight: 85,
      height: 70,
      marginVertical: 20,
    },
    ratingLabelsView: {
      marginLeft: 15,
      height: 70,
      justifyContent: "space-around",
    },
    ratingLabel: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
      fontSize: 10,
    },
    ratingLinesView: {
      flexGrow: 1,
      height: 70,
      marginLeft: 15,
      justifyContent: "space-around",
    },
    ratingLineOuter: {
      height: 5,
      backgroundColor: colors.tertiary,
      borderRadius: 5,
    },
    ratingLineInner: {
      backgroundColor: colors.primary,
      height: "100%",
      borderRadius: 5,
    },
    achievementsView: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 20,
    },
    achievementView: {
      alignItems: "center",
    },
    achievement: {
      width: 0.1 * windowWidth,
      height: 0.1 * windowWidth,
    },
    achievementTitle: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
      marginTop: 5,
      fontSize: 12,
    },
    achievementValue: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
      fontSize: 16,
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
  });
