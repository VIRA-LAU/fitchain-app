import { StackScreenProps } from "@react-navigation/stack";
import { Image, StyleSheet, useWindowDimensions, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader, BranchLocation, RateCriteria } from "src/components";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useBranchesQuery } from "src/api";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useCreateRatingMutation } from "src/api/mutations/users/create-player-rating";

type Props = StackScreenProps<HomeStackParamList, "RatePlayer">;

export const RatePlayer = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(
    colors,
    useWindowDimensions().width,
    useWindowDimensions().height
  );
  const { playerId, firstName, lastName, gameId } = route.params;
  const { mutate: createRating } = useCreateRatingMutation(route.params.gameId);

  const [ratings, setRatings] = useState({
    PERFORMANCE: 3,
    PUNCTUALITY: 3,
    FAIRPLAY: 3,
    "TEAM PLAYER": 3,
  });
  function handleRatePlayer() {
    const rating = {
      performance: ratings["PERFORMANCE"],
      punctuality: ratings["PUNCTUALITY"],
      fairplay: ratings["FAIRPLAY"],
      teamPlayer: ratings["TEAM PLAYER"],
      gameId: gameId,
      playerId: playerId,
    };
    createRating(rating);
  }
  function handleChangeRating(name: string, rating: number) {
    setRatings({
      ...ratings,
      [name]: rating,
    });
  }
  return (
    <AppHeader
      navigation={navigation}
      route={route}
      title={`Rate Player`}
      backEnabled
    >
      <ScrollView>
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
          </View>
        </View>
        <View style={{ alignItems: "center", marginTop: 25 }}>
          <Text style={styles.PlayerName}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.question}>
            How would you rate {firstName} based on this game?
          </Text>
          <View style={styles.rateCriteria}>
            <RateCriteria
              name="PERFORMANCE"
              onRatingChange={handleChangeRating}
            ></RateCriteria>
            <RateCriteria
              name="PUNCTUALITY"
              onRatingChange={handleChangeRating}
            ></RateCriteria>
            <RateCriteria
              name="FAIRPLAY"
              onRatingChange={handleChangeRating}
            ></RateCriteria>
            <RateCriteria
              name="TEAM PLAYER"
              onRatingChange={handleChangeRating}
            ></RateCriteria>
          </View>
          <View style={styles.rateButtonView}>
            <Button
              style={styles.rateButton}
              onPress={() => handleRatePlayer()}
            >
              <Text style={styles.rateButtonText}>Rate Player</Text>
            </Button>
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
    rateButtonView: {
      marginTop: 10,
      width: "95%",
    },
    rateButtonText: {
      color: colors.background,
      fontWeight: "700",
      fontSize: 16,
    },
    rateButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
    },
    rateCriteria: {
      marginTop: 20,
      width: "95%",
    },
    question: {
      fontSize: 20,
      textAlign: "center",
      color: "white",
      width: "70%",
      fontWeight: "600",
      alignContent: "center",
      marginTop: 40,
      alignSelf: "center",
    },
    PlayerName: {
      fontWeight: "600",
      fontSize: 30,
      color: "white",
    },
    headerView: {
      backgroundColor: colors.background,
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
      marginTop: 10,
      marginBottom: 20,
      textAlign: "center",
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
    placeholderText: {
      height: 50,
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
      textAlignVertical: "center",
      marginBottom: -10,
    },
  });
