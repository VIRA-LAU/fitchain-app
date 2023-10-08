import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import { useTheme, Text, ActivityIndicator, Button } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
  AppHeader,
  GenericDialog,
  getMins,
  parseTimeFromMinutes,
} from "src/components";
import FeatherIcon from "react-native-vector-icons/Feather";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "src/navigation";
import { useCreateGameMutation } from "src/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = StackScreenProps<StackParamList, "BookingPayment">;

export const BookingPayment = ({
  navigation,
  route,
  setPlayScreenStillVisible,
}: Props & {
  setPlayScreenStillVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const {
    venueName,
    courtId,
    courtName,
    courtType,
    courtRating,
    price,
    branchLatLng,
    profilePhotoUrl,
    date: dateStr,
    startTime: startTimeStr,
    endTime: endTimeStr,
  } = route.params;

  const { mutate: createGame, isLoading, error } = useCreateGameMutation();

  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  const date = new Date(dateStr);
  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);

  const endHours =
    endTime.getHours() * 60 + endTime.getMinutes() === 0
      ? 1440
      : endTime.getHours() * 60 + endTime.getMinutes();
  const startHours = startTime.getHours() * 60 + startTime.getMinutes();
  const bookedHours = (endHours - startHours) / 60;

  useEffect(() => {
    if (error && error.response?.data.message === "EXISTING_GAME_OVERLAP")
      setErrorDialogVisible(true);
  }, [error]);

  return (
    <AppHeader absolutePosition={false} title={"Booking Summary"} backEnabled>
      <ScrollView contentContainerStyle={styles.wrapperView}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              source={require("assets/images/home/basketball-court-icon.png")}
            />
            <View style={styles.headerContentInfo}>
              <Text
                style={{ color: colors.primary, fontFamily: "Poppins-Medium" }}
              >
                {courtName}
              </Text>
              {/* <Text style={styles.headerContentText}>{courtType}</Text> */}
              <View style={styles.rating}>
                <FeatherIcon
                  name={`star`}
                  color={colors.tertiary}
                  size={16}
                  style={{ paddingBottom: 3 }}
                />
                <Text style={[styles.headerContentText, { marginLeft: 5 }]}>
                  {courtRating.toFixed(1)}
                </Text>
              </View>
            </View>
            {profilePhotoUrl && (
              <Image
                source={{
                  uri: profilePhotoUrl,
                }}
                resizeMode="contain"
                style={{
                  flex: 1,
                  height: "50%",
                  marginLeft: "auto",
                }}
              />
            )}
          </View>
          <Button
            style={{ alignSelf: "center" }}
            icon={"arrow-right-top"}
            onPress={() => {
              const scheme = Platform.select({
                ios: "maps://0,0?q=",
                android: "geo:0,0?q=",
              });
              const latLng = `${branchLatLng[0]},${branchLatLng[1]}`;
              const label = venueName;

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
        <View style={styles.contentView}>
          <View style={styles.contentRow}>
            <Text style={styles.labelText}>Date</Text>
            <View style={styles.contentIconView}>
              <Text style={[styles.valueText, { marginRight: 10 }]}>
                {date
                  .toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                  .slice(0, Platform.OS === "ios" ? -5 : -6)}
              </Text>
              {/* <Feather name="edit-3" color={colors.tertiary} size={16} /> */}
            </View>
          </View>
          <View style={styles.contentRow}>
            <Text style={styles.labelText}>Time slot</Text>
            <View style={styles.contentIconView}>
              <Text style={[styles.valueText, { marginRight: 10 }]}>
                {parseTimeFromMinutes(getMins(startTime))} -{" "}
                {parseTimeFromMinutes(getMins(endTime))}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.contentView}>
          <View style={styles.contentRow}>
            <Text style={styles.labelText}>Court Price</Text>
            <Text
              style={[
                styles.valueText,
                { marginRight: 10, color: colors.tertiary },
              ]}
            >
              USD {price}/hr
            </Text>
          </View>
          <View style={styles.contentRow}>
            <Text style={styles.labelText}>Booked Hours</Text>
            <Text
              style={[
                styles.valueText,
                { marginRight: 10, color: colors.tertiary },
              ]}
            >
              {bookedHours}
            </Text>
          </View>
          <View style={styles.contentRow}>
            <Text style={[styles.labelText, { color: colors.tertiary }]}>
              Total
            </Text>
            <Text style={[styles.valueText, { marginRight: 10 }]}>
              USD {price * bookedHours}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: "auto" }}>
          <View style={styles.nextView}>
            <Button
              mode="contained"
              style={styles.next}
              loading={isLoading}
              onPress={
                !isLoading
                  ? () => {
                      setPlayScreenStillVisible(false);
                      createGame({
                        courtId,
                        startTime: startTimeStr,
                        endTime: endTimeStr,
                        type: courtType,
                      });
                    }
                  : undefined
              }
            >
              Proceed to Payment
            </Button>
          </View>
        </View>
      </ScrollView>
      <GenericDialog
        visible={errorDialogVisible}
        setVisible={setErrorDialogVisible}
        title="Booking Overlap"
        text="A game was recently booked during this time. Please try again."
      />
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexGrow: 1,
    },
    header: {
      marginBottom: 10,
      paddingHorizontal: 20,
      paddingBottom: 10,
      backgroundColor: colors.secondary,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerContentInfo: {
      marginHorizontal: 20,
    },
    headerContentText: {
      color: colors.tertiary,
      fontFamily: "Poppins-Medium",
      marginVertical: 1,
    },
    contentView: {
      backgroundColor: colors.secondary,
      marginVertical: 10,
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 12,
    },
    contentIconView: {
      flexDirection: "row",
      alignItems: "center",
    },
    contentRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 10,
      flex: 1,
    },
    labelText: {
      fontFamily: "Poppins-Regular",
      color: colors.tertiary,
    },
    valueText: {
      fontFamily: "Poppins-Medium",
      color: colors.tertiary,
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
    },
    nextView: {
      borderColor: colors.secondary,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderRadius: 12,
      marginTop: 16,
      marginBottom: 16,
    },
    next: {
      height: 44,
      justifyContent: "center",
      marginTop: 24,
      marginBottom: 34,
      marginHorizontal: 16,
    },
  });
