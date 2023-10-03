import {
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { AppHeader, ImageList, Skeleton } from "src/components";
import {
  BranchLocation,
  BranchLocationSkeleton,
} from "src/components/home/game-details/BranchLocation";
import { StackParamList } from "src/navigation";
import { StackScreenProps } from "@react-navigation/stack";
import { useBranchByIdQuery } from "src/api";
import { useState } from "react";
import { Play } from "./Play";

type Props = StackScreenProps<StackParamList, "BranchDetails">;

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
    <AppHeader title={branch?.venue.name} backEnabled middleTitle>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          {!isLoading ? (
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
          ) : (
            <View
              style={[
                styles.headerImage,
                { backgroundColor: colors.background },
              ]}
            />
          )}
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
                      backgroundColor: colors.secondary,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Medium",
                        fontSize: 16,
                        color: colors.tertiary,
                        textAlign: "center",
                        margin: 10,
                      }}
                    >
                      {branch?.venue.name}
                    </Text>
                  </View>
                )
              ) : (
                <Skeleton
                  style={{
                    width: 0.33 * windowWidth,
                    aspectRatio: 1,
                  }}
                />
              )}
            </View>
            {isLoading ? (
              <Skeleton height={20} width={180} style={styles.headerText} />
            ) : branch?.venue.description ? (
              <Text style={styles.headerText}>{branch?.venue.description}</Text>
            ) : (
              <View style={{ marginBottom: 15 }} />
            )}
            {/* {!playScreenBookingDetails && (
              <View style={styles.buttonsView}>
                <TouchableOpacity
                  activeOpacity={0.8}
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

                <View style={{ width: "50%" }}>
                  <Button
                    icon={() => (
                      <FeatherIcon
                        name="thumbs-up"
                        size={22}
                        color={colors.tertiary}
                      />
                    )}
                    textColor={colors.tertiary}
                  >
                    Follow Venue
                  </Button>
                </View>
              </View>
            )} */}
          </View>
        </View>

        <View style={styles.contentView}>
          <View style={[styles.ratingView, { marginBottom: 16 }]}>
            <View style={{ width: "50%" }}>
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 16,
                  color: colors.tertiary,
                }}
              >
                Pricing
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 32,
                  color: colors.primary,
                }}
              >
                {pricesStr}{" "}
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 20,
                    color: colors.tertiary,
                  }}
                >
                  $/hour
                </Text>
              </Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 16,
                  color: colors.tertiary,
                }}
              >
                Ratings
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 32,
                  color: colors.primary,
                }}
              >
                4.2{" "}
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 20,
                    color: colors.tertiary,
                  }}
                >
                  /5
                </Text>
              </Text>
            </View>
          </View>
          <View style={[styles.ratingView, { marginBottom: 24 }]}>
            <View style={styles.ratingLabelsView}>
              <Text style={styles.ratingLabel}>CLEANLINESS</Text>
              <Text style={styles.ratingLabel}>PUNCTUALITY</Text>
              <Text style={styles.ratingLabel}>VALUE FOR MONEY</Text>
              <Text style={styles.ratingLabel}>STAFF</Text>
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

          <ImageList images={branch?.branchPhotoUrl} isLoading={isLoading} />

          <Button
            mode="contained"
            style={{ height: 45, justifyContent: "center", marginVertical: 24 }}
            onPress={() => {
              if (playScreenBookingDetails)
                navigation.push("ChooseCourt", {
                  branchId: branch!.id,
                  branchLocation: branch!.location,
                  venueName: branch!.venue!.name,
                  bookingDetails: playScreenBookingDetails!,
                  profilePhotoUrl: branch!.profilePhotoUrl,
                });
              else setPlayScreenVisible(true);
            }}
          >
            Book Court
          </Button>

          {/* <View style={styles.bookCourtPressableView}>
            <TouchableOpacity
              activeOpacity={0.8}
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
                <Text variant="labelMedium" style={{ color: colors.secondary }}>
                  USD {pricesStr}/hr
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}

          <View>
            <Text
              variant="labelLarge"
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 16,
                color: colors.tertiary,
                marginBottom: 16,
              }}
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

          <Button
            style={{ marginTop: 10, alignSelf: "center" }}
            icon={"arrow-right-top"}
            onPress={() => {
              const scheme = Platform.select({
                ios: "maps://0,0?q=",
                android: "geo:0,0?q=",
              });
              const latLng = `${branch?.latitude},${branch?.longitude}`;
              const label = branch?.venue.name;

              Linking.openURL(
                Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                })!
              );
            }}
          >
            Get Directions
          </Button>
        </View>
      </ScrollView>

      <Play
        visible={playScreenVisible}
        setVisible={setPlayScreenVisible}
        branch={branch}
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
      fontFamily: "Poppins-Medium",
      color: colors.tertiary,
      marginTop: 12,
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
      padding: 16,
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
    ratingView: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
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
  });
