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
import { AppHeader, getMins, parseTimeFromMinutes } from "src/components";
import Feather from "react-native-vector-icons/Feather";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "src/navigation";
import { useCreateGameMutation } from "src/api";
import { useState } from "react";

type Props = StackScreenProps<StackParamList, "BookingPayment">;

export const BookingPayment = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const {
    venueName,
    courtName,
    courtType,
    courtRating,
    courtMaxPlayers,
    price,
    branchLatLng,
    bookingDetails,
    profilePhotoUrl,
  } = route.params;

  const { mutate: createGame, isLoading } = useCreateGameMutation();

  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(
    bookingDetails.nbOfPlayers
  );

  const date = new Date(bookingDetails.date);
  var time = bookingDetails.time;
  time.startTime = new Date(time.startTime);
  time.endTime = new Date(time.endTime);

  const endHours =
    time.endTime.getHours() * 60 + time.endTime.getMinutes() === 0
      ? 1440
      : time.endTime.getHours() * 60 + time.endTime.getMinutes();
  const startHours =
    time.startTime.getHours() * 60 + time.startTime.getMinutes();
  const bookedHours = (endHours - startHours) / 60;

  return (
    <AppHeader
      absolutePosition={false}
      title={venueName}
      right={<IonIcon name="ellipsis-horizontal" color="white" size={24} />}
      backEnabled
    >
      <ScrollView contentContainerStyle={styles.wrapperView}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              source={require("assets/images/home/basketball-court-icon.png")}
            />
            <View style={styles.headerContentInfo}>
              <Text style={{ color: "white", fontFamily: "Inter-SemiBold" }}>
                {courtName}
              </Text>
              <Text style={styles.headerContentText}>{courtType}</Text>
              <View style={styles.rating}>
                <FeatherIcon name={`star`} color={colors.tertiary} size={14} />
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
            textColor="white"
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
        <View
          style={[
            styles.contentView,
            {
              flexDirection: "row",
              justifyContent: "space-between",
            },
          ]}
        >
          <View style={styles.contentIconView}>
            <MatComIcon
              name={"account-outline"}
              size={20}
              color={"white"}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.labelText}>How many players?</Text>
          </View>
          <View style={styles.contentIconView}>
            <TouchableOpacity
              onPress={() => {
                if (numberOfPlayers > 1)
                  setNumberOfPlayers((oldNum) => oldNum - 1);
              }}
            >
              <Feather name="minus-circle" color={colors.primary} size={24} />
            </TouchableOpacity>
            <Text
              style={[
                styles.labelText,
                {
                  fontSize: 18,
                  width: 40,
                  textAlign: "center",
                  color: "white",
                },
              ]}
            >
              {numberOfPlayers}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (numberOfPlayers < courtMaxPlayers)
                  setNumberOfPlayers((oldNum) => oldNum + 1);
              }}
            >
              <Feather name="plus-circle" color={colors.primary} size={24} />
            </TouchableOpacity>
          </View>
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
              {/* <Feather name="edit-3" color={"white"} size={16} /> */}
            </View>
          </View>
          <View style={styles.contentRow}>
            <Text style={styles.labelText}>Time slot</Text>
            <View style={styles.contentIconView}>
              <Text style={[styles.valueText, { marginRight: 10 }]}>
                {parseTimeFromMinutes(getMins(time.startTime))} -{" "}
                {parseTimeFromMinutes(getMins(time.endTime))}
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
            <Text style={[styles.labelText, { color: "white" }]}>Total</Text>
            <Text style={[styles.valueText, { marginRight: 10 }]}>
              USD {price * bookedHours}
            </Text>
          </View>
        </View>
        {isLoading ? (
          <View style={styles.paymentViewWrapper}>
            <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
          </View>
        ) : (
          <View style={styles.paymentViewWrapper}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.paymentView}
              onPress={() => {
                const startTime = new Date(date);
                startTime.setHours(
                  (time.startTime as Date).getHours(),
                  (time.startTime as Date).getMinutes(),
                  0,
                  0
                );
                const endTime = new Date(date);
                endTime.setHours(
                  (time.endTime as Date).getHours() === 0
                    ? 24
                    : (time.endTime as Date).getHours(),
                  (time.endTime as Date).getMinutes(),
                  0,
                  0
                );
                createGame({
                  courtId: bookingDetails.courtId,
                  startTime: startTime.toISOString(),
                  endTime: endTime.toISOString(),
                  type: bookingDetails.gameType,
                });
              }}
            >
              <View>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 10 }}>
                  TOTAL
                </Text>
                <Text style={{ fontFamily: "Inter-Medium" }}>
                  USD {price * bookedHours}
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter-SemiBold" }}>
                Continue To Payment
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
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
      fontFamily: "Inter-SemiBold",
      marginVertical: 1,
    },
    contentView: {
      backgroundColor: colors.secondary,
      marginVertical: 10,
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 10,
      borderColor: colors.tertiary,
      borderWidth: 0.5,
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
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
    },
    valueText: {
      fontFamily: "Inter-SemiBold",
      color: "white",
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
    },
    paymentViewWrapper: {
      marginTop: "auto",
    },
    paymentView: {
      height: 65,
      backgroundColor: colors.primary,
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
    },
  });