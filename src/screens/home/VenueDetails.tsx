import {
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useContext, useState } from "react";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { AppHeader, SportTypeDropdown, BranchLocation } from "src/components";
import { HomeStackParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import { StackScreenProps } from "@react-navigation/stack";
import { useVenueByIdQuery } from "src/api";
import { UserContext } from "src/utils";

type Props = StackScreenProps<HomeStackParamList, "VenueDetails">;

export const VenueDetails = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const styles = makeStyles(colors, windowWidth, windowHeight);

  const [selectedSports, setSelectedSports] = useState({
    basketball: true,
    football: true,
    tennis: true,
  });

  const { id } = route.params;
  const { userData } = useContext(UserContext);
  const { data: venue } = useVenueByIdQuery(userData!, id);

  console.log(useVenueByIdQuery);
  return (
    <AppHeader
      navigation={navigation}
      route={route}
      right={<IonIcon name="ellipsis-horizontal" color="white" size={24} />}
      title={venue?.name}
      // left={
      //   <SportTypeDropdown
      //     selectedSports={selectedSports}
      //     setSelectedSports={setSelectedSports}
      //   />
      // }
      backEnabled
    >
      <View>
        <View style={styles.headerView}>
          <Image
            source={require("assets/images/home/basketball-hub.png")}
            style={styles.headerImage}
          />
          <View style={styles.headerContent}>
            <Image
              source={require("assets/images/home/basketball-hub-icon.png")}
              style={styles.clubIcon}
            />
            <Text style={styles.headerText}>{venue?.description}</Text>
            <View style={styles.buttonsView}>
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
                buttonColor={colors.primary}
              >
                Book Court
              </Button>
              <Button
                icon={() => (
                  <FeatherIcon name="thumbs-up" size={22} color={"white"} />
                )}
                style={{ borderRadius: 5, flex: 1 }}
                textColor={"white"}
                buttonColor={"transparent"}
              >
                Follow Venue
              </Button>
            </View>
          </View>
        </View>
        <View style={styles.contentView}>
          <Text variant="labelLarge" style={{ color: colors.tertiary }}>
            Teams
          </Text>
          <View style={styles.teamsView}>
            <Text style={styles.rating}>4.2</Text>
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <Text variant="labelLarge" style={{ color: colors.tertiary }}>
              Requests (2)
            </Text>

            <FeatherIcon
              name="chevron-right"
              color={colors.tertiary}
              size={20}
              style={{ marginLeft: "auto" }}
            />
          </View>
          <View style={styles.divider} />
          <Text
            variant="labelLarge"
            style={{ color: colors.tertiary, marginTop: 20 }}
          >
            Photos
          </Text>
          <ScrollView style={styles.photosView} horizontal>
            <Image
              source={require("assets/images/home/profile-background.png")}
              resizeMode={"contain"}
              style={{
                height: 0.25 * windowHeight,
                width: 0.25 * windowHeight,
                marginLeft: 20,
              }}
            />
            <View style={styles.smallPhotosView}>
              <Image
                source={require("assets/images/home/profile-background.png")}
                resizeMode={"contain"}
                style={{
                  height: "48%",
                  aspectRatio: 1,
                }}
              />
              <Image
                source={require("assets/images/home/profile-background.png")}
                resizeMode={"contain"}
                style={{
                  height: "48%",
                  aspectRatio: 1,
                }}
              />
            </View>
            <Image
              source={require("assets/images/home/profile-background.png")}
              resizeMode={"contain"}
              style={{
                height: 0.25 * windowHeight,
                width: 0.25 * windowHeight,
                marginRight: 20,
              }}
            />
            <View style={styles.uploadPhoto}>
              <IonIcon name="camera-outline" color={"white"} size={20} />
              <Text style={styles.uploadPhotoText}>Upload Photo</Text>
            </View>
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <View style={styles.divider} />
            <Text variant="labelLarge" style={{ color: colors.tertiary }}>
              Branches
            </Text>

            <FeatherIcon
              name="chevron-right"
              color={colors.tertiary}
              size={20}
              style={{ marginLeft: "auto" }}
            />
          </View>
          {venue?.branches.map((branch, index: number) => {
            const pricesArr = branch.courts.map(({ price }) => price);
            const prices =
              pricesArr.length === 1
                ? pricesArr[0].toString()
                : `${Math.min.apply(null, pricesArr)} - ${Math.max.apply(
                    null,
                    pricesArr
                  )}`;
            return (
              <BranchLocation
                key={index}
                type="branch"
                branch={{
                  location: branch.location,
                  courts: branch.courts
                    .map(({ courtType }) => courtType)
                    .join(", "),
                  prices,
                }}
              />
            );
          })}
          <Text style={styles.viewAll}>View All</Text>
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
    clubIcon: {
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
    headerText: {
      fontFamily: "Inter-Medium",
      lineHeight: 20,
      color: "white",
      marginTop: 5,
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
    photosView: {
      flexDirection: "row",
      marginTop: 20,
      marginHorizontal: -20,
    },
    smallPhotosView: {
      height: 0.25 * windowHeight,
      flexDirection: "column",
      marginHorizontal: 10,
      justifyContent: "space-between",
    },
    uploadPhoto: {
      position: "absolute",
      bottom: 5,
      left: 25,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.secondary,
      opacity: 0.9,
      padding: 7.5,
      borderRadius: 10,
    },
    uploadPhotoText: {
      color: "white",
      marginLeft: 5,
      fontFamily: "Inter-Medium",
      fontSize: 12,
    },
    viewAll: {
      color: colors.tertiary,
      marginVertical: 10,
      fontFamily: "Inter-Medium",
      alignSelf: "center",
    },
    divider: {
      borderColor: colors.secondary,
      borderBottomWidth: 1,
    },
  });
