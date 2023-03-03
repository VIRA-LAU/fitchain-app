import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Image, useWindowDimensions } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { ActivityCard, AppHeader } from "src/components";
import { BottomTabParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Activity } from "src/types";
import { useContext } from "react";
import { UserContext } from "src/utils";
import { useGamesQuery } from "src/api";

type Props = BottomTabScreenProps<BottomTabParamList>;

export const Profile = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(
    colors,
    useWindowDimensions().width,
    useWindowDimensions().height
  );

  const { userData } = useContext(UserContext);
  const { firstName, lastName } = userData!;

  const { data: games } = useGamesQuery(userData!);

  const activities: Activity[] = [
    { date: new Date("2022-12-12T10:10:15"), gameType: "basketball" },
  ];

  return (
    <AppHeader
      navigation={navigation}
      route={route}
      right={<IonIcon name="ellipsis-horizontal" color="white" size={24} />}
      title={`${firstName} ${lastName}`}
      backEnabled
    >
      <View>
        <View style={styles.headerView}>
          <Image
            source={require("assets/images/home/profile-background.png")}
            style={styles.headerImage}
          />
          <View style={styles.headerContent}>
            <Image
              source={require("assets/images/home/profile-picture.png")}
              style={styles.profilePicture}
            />
            <Text style={styles.headerText1}>Played {games?.length} games</Text>
            <Text style={styles.headerText2}>
              Enjoy playing sports as a professional hobby. Runner, football
              player, member of the Lebanese Football Association.
            </Text>
            {/* <View style={styles.buttonsView}>
              <Button
                icon={() => (
                  <IonIcon
                    name={"basketball-outline"}
                    size={26}
                    color={colors.secondary}
                  />
                )}
                style={{ borderRadius: 5, flex: 1 }}
                textColor={colors.secondary}
                buttonColor={colors.tertiary}
              >
                Invite To Play
              </Button>
              <Button
                icon={() => (
                  <FeatherIcon name="thumbs-up" size={22} color={"white"} />
                )}
                style={{ borderRadius: 5, flex: 1 }}
                textColor={"white"}
                buttonColor={"transparent"}
              >
                Follow Player
              </Button>
            </View> */}
          </View>
        </View>
        <View style={styles.contentView}>
          <Text variant="labelLarge" style={{ color: colors.tertiary }}>
            Teams
          </Text>
          <View style={styles.teamsView}>
            <Text style={styles.rating}>3.6</Text>
            <View style={styles.ratingLabelsView}>
              <Text style={styles.ratingLabel}>PERFORMANCE</Text>
              <Text style={styles.ratingLabel}>PUNCTUALITY</Text>
              <Text style={styles.ratingLabel}>TEAMPLAYER</Text>
              <Text style={styles.ratingLabel}>FAIR PLAY</Text>
            </View>
            <View style={styles.ratingLinesView}>
              <View style={styles.ratingLineOuter}>
                <View style={[styles.ratingLineInner, { width: "90%" }]} />
              </View>
              <View style={styles.ratingLineOuter}>
                <View style={[styles.ratingLineInner, { width: "60%" }]} />
              </View>
              <View style={styles.ratingLineOuter}>
                <View style={[styles.ratingLineInner, { width: "80%" }]} />
              </View>
              <View style={styles.ratingLineOuter}>
                <View style={[styles.ratingLineInner, { width: "100%" }]} />
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

const makeStyles = (
  colors: MD3Colors,
  windowWidth: number,
  windowHeight: number
) =>
  StyleSheet.create({
    headerView: {
      backgroundColor: colors.secondary,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
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
    profilePicture: {
      width: 0.33 * windowWidth,
      height: 0.33 * windowWidth,
      marginTop: (-0.33 * windowWidth) / 2,
    },
    buttonsView: {
      flexDirection: "row",
      margin: 15,
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerText1: {
      fontFamily: "Inter-SemiBold",
      color: colors.tertiary,
      marginTop: 15,
    },
    headerText2: {
      fontFamily: "Inter-Medium",
      lineHeight: 20,
      color: "white",
      marginVertical: 10,
      textAlign: "center",
    },
    contentView: {
      padding: 20,
    },
    teamsView: {
      flexDirection: "row",
      alignItems: "center",
    },
    rating: {
      fontFamily: "Inter-SemiBold",
      color: "white",
      fontSize: 70,
      lineHeight: 70 - 1.5,
      height: 70 - 16,
      marginVertical: 20,
    },
    ratingLabelsView: {
      marginLeft: 15,
      height: 70,
      justifyContent: "space-around",
    },
    ratingLabel: {
      fontFamily: "Inter-SemiBold",
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
      backgroundColor: colors.secondary,
      borderRadius: 5,
    },
    ratingLineInner: {
      backgroundColor: colors.tertiary,
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
      fontFamily: "Inter-SemiBold",
      color: colors.tertiary,
      marginTop: 5,
      fontSize: 12,
    },
    achievementValue: {
      fontFamily: "Inter-SemiBold",
      color: "white",
      fontSize: 16,
    },
    divider: {
      borderColor: colors.secondary,
      borderBottomWidth: 1,
    },
  });
