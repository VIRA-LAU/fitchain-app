import { StackScreenProps } from "@react-navigation/stack";
import { Image, StyleSheet, useWindowDimensions, View } from "react-native";
import { Avatar, Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader, RateCriteria } from "src/components";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import { useCreateRatingMutation } from "src/api";

type Props = StackScreenProps<HomeStackParamList, "RatePlayer">;

export const RatePlayer = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const styles = makeStyles(colors, windowWidth, windowHeight);
  const {
    playerId,
    firstName,
    lastName,
    gameId,
    profilePhotoUrl,
    coverPhotoUrl,
  } = route.params;

  const { mutate: createRating } = useCreateRatingMutation();

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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.headerView}>
          <Image
            source={
              coverPhotoUrl
                ? {
                    uri: coverPhotoUrl,
                  }
                : require("assets/images/home/profile-background.png")
            }
            style={styles.headerImage}
          />
          <View
            style={{
              marginTop: (-0.33 * windowWidth) / 2,
              alignSelf: "center",
            }}
          >
            {profilePhotoUrl ? (
              <Avatar.Image
                source={{ uri: profilePhotoUrl }}
                size={0.33 * windowWidth}
              />
            ) : (
              <Avatar.Text
                label={`${firstName.charAt(0)}${lastName.charAt(0)}`}
                style={{
                  backgroundColor: colors.secondary,
                }}
                size={0.33 * windowWidth}
              />
            )}
          </View>
        </View>
        <View style={{ alignItems: "center", marginTop: 25, flexGrow: 1 }}>
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
          <Button
            style={styles.rateButton}
            textColor={colors.secondary}
            onPress={() => handleRatePlayer()}
          >
            Rate Player
          </Button>
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
    rateButton: {
      backgroundColor: colors.primary,
      borderRadius: 5,
      marginTop: "auto",
      marginBottom: 20,
      width: "95%",
    },
    rateCriteria: {
      marginTop: 20,
      width: "95%",
    },
    question: {
      textAlign: "center",
      color: "white",
      width: "70%",
      fontFamily: "Inter-Medium",
      alignContent: "center",
      marginTop: 15,
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
    buttonsView: {
      flexDirection: "row",
      margin: 15,
      justifyContent: "space-between",
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
  });
