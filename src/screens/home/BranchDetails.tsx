import {
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  AppHeader,
  BranchLocation,
  BranchLocationSkeleton,
  ImageList,
  Skeleton,
} from "src/components";
import { HomeStackParamList } from "src/navigation";
import IonIcon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import { StackScreenProps } from "@react-navigation/stack";
import { useBranchByIdQuery } from "src/api";
import { useState } from "react";
import { Play } from "./Play";

type Props = StackScreenProps<HomeStackParamList, "BranchDetails">;

export const BranchDetails = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const styles = makeStyles(colors, windowWidth, windowHeight);

  const { id, playScreenBookingDetails } = route.params;

  const { data: branch, isLoading } = useBranchByIdQuery(id);

  const [playScreenVisible, setPlayScreenVisible] = useState<boolean>(false);

  const courtPrices: number[] = [];
  branch?.courts.forEach((court) => courtPrices.push(court.price));

  const pricesStr =
    courtPrices.length > 0
      ? courtPrices.length === 1
        ? courtPrices[0].toString()
        : `${Math.min.apply(null, courtPrices!)}-${Math.max.apply(
            null,
            courtPrices!
          )}`
      : "";

  return (
    <AppHeader
      navigation={navigation}
      route={route}
      title={branch?.venue.name}
      backEnabled
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.headerView}>
          <Image
            source={
              branch?.coverPhotoUrl
                ? {
                    uri: branch.coverPhotoUrl,
                  }
                : require("assets/images/home/basketball-hub.png")
            }
            style={styles.headerImage}
          />
          <View style={styles.headerContent}>
            <View
              style={{
                marginTop: (-0.33 * windowWidth) / 2,
              }}
            >
              {!isLoading ? (
                branch?.profilePhotoUrl ? (
                  <Image
                    source={{ uri: branch.profilePhotoUrl }}
                    style={styles.profilePhoto}
                  />
                ) : (
                  <View
                    style={{
                      ...styles.profilePhoto,
                      backgroundColor: colors.background,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter-Medium",
                        fontSize: 16,
                        color: "white",
                        textAlign: "center",
                        margin: 10,
                      }}
                    >
                      {branch?.venue.name}
                    </Text>
                  </View>
                )
              ) : (
                <View style={styles.profilePhoto} />
              )}
            </View>
            {isLoading ? (
              <Skeleton height={20} width={180} style={styles.headerText} />
            ) : branch?.venue.description ? (
              <Text style={styles.headerText}>{branch?.venue.description}</Text>
            ) : (
              <View style={{ marginVertical: 15 }} />
            )}
            {!playScreenBookingDetails && (
              <View style={styles.buttonsView}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.headerBookCourtPressable}
                  onPress={() => {
                    setPlayScreenVisible(true);
                  }}
                >
                  <IonIcon
                    name={"basketball-outline"}
                    size={30}
                    color={colors.secondary}
                  />
                  <View style={{ marginLeft: 5 }}>
                    <Text variant="titleSmall" style={styles.bookCourtButton}>
                      Book Court
                    </Text>
                    <Text
                      variant="labelMedium"
                      style={{ color: colors.secondary }}
                    >
                      USD {pricesStr}/hr
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={{ borderRadius: 5, width: "50%" }}>
                  <Button
                    icon={() => (
                      <FeatherIcon name="thumbs-up" size={22} color={"white"} />
                    )}
                    textColor={"white"}
                    buttonColor={"transparent"}
                  >
                    Follow Venue
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={styles.contentView}>
          <View>
            <Text
              variant="labelLarge"
              style={{ color: colors.tertiary, marginBottom: 20 }}
            >
              Branch
            </Text>
            {isLoading ? (
              <BranchLocationSkeleton />
            ) : (
              <BranchLocation
                type="branch"
                branch={{
                  id: branch!.id,
                  location: branch!.location,
                  courts: branch!.courts,
                  rating: branch!.rating,
                  venueName: branch!.venue.name,
                  latitude: branch!.latitude,
                  longitude: branch!.longitude,
                  profilePhotoUrl: branch!.profilePhotoUrl,
                }}
              />
            )}
          </View>
          <View style={[styles.divider, { marginVertical: 20 }]} />
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
          <ImageList images={branch?.branchPhotoUrl} isLoading={isLoading} />
          {playScreenBookingDetails && (
            <View style={styles.bookCourtPressableView}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.bookCourtPressable}
                onPress={() => {
                  navigation.push("ChooseCourt", {
                    branchId: branch!.id,
                    branchLocation: branch!.location,
                    venueName: branch!.venue!.name,
                    bookingDetails: playScreenBookingDetails!,
                    profilePhotoUrl: branch!.profilePhotoUrl,
                  });
                }}
              >
                <IonIcon
                  name={"basketball-outline"}
                  size={30}
                  color={colors.secondary}
                />
                <View style={{ marginLeft: 5 }}>
                  <Text variant="titleSmall" style={styles.bookCourtButton}>
                    Book Court
                  </Text>
                  <Text
                    variant="labelMedium"
                    style={{ color: colors.secondary }}
                  >
                    USD {pricesStr}/hr
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <Play
        visible={playScreenVisible}
        setVisible={setPlayScreenVisible}
        branchId={id}
        branchLocation={branch?.location}
        branchProfilePhotoUrl={branch?.profilePhotoUrl}
        venueName={branch?.venue.name}
      />
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
    profilePhoto: {
      backgroundColor: "transparent",
      width: 0.33 * windowWidth,
      aspectRatio: 1,
    },
    headerText: {
      fontFamily: "Inter-Medium",
      lineHeight: 20,
      color: "white",
      marginVertical: 15,
      textAlign: "center",
    },
    buttonsView: {
      flexDirection: "row",
      margin: 15,
      marginTop: 0,
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentView: {
      padding: 20,
      flex: 1,
    },
    headerBookCourtPressable: {
      borderRadius: 5,
      height: "100%",
      width: "50%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: colors.primary,
    },
    bookCourtPressableView: {
      marginTop: "auto",
    },
    bookCourtPressable: {
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      marginTop: 20,
      height: 50,
      width: "100%",
      alignSelf: "center",
      backgroundColor: colors.primary,
    },
    bookCourtButton: {
      color: colors.secondary,
    },
    teamsView: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
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
    divider: {
      borderColor: colors.secondary,
      borderBottomWidth: 1,
    },
  });
