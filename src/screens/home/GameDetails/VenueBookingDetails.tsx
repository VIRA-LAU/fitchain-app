import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { AppHeader } from "src/components";
import Feather from "react-native-vector-icons/Feather";
import MatComIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "src/navigation";
import { useCreateGameMutation } from "src/api";

type Props = StackScreenProps<HomeStackParamList, "VenueBookingDetails">;

export const VenueBookingDetails = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const { venueName, courtType, price, bookingDetails } = route.params;
  const styles = makeStyles(colors);

  const { mutate: createGame } = useCreateGameMutation();

  return (
    <AppHeader
      absolutePosition={false}
      title={venueName}
      right={<IonIcon name="ellipsis-horizontal" color="white" size={24} />}
      navigation={navigation}
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
                {courtType}
              </Text>
              <Text style={styles.headerContentText}>Outdoors(?)</Text>
              <Text style={styles.headerContentText}>Grass floor(?)</Text>
              <Text style={styles.headerContentText}>Air-Conditioned(?)</Text>
            </View>
            <Image
              source={require("assets/images/home/basketball-hub-icon.png")}
              resizeMode={"contain"}
              style={{ flex: 1, height: "50%", marginLeft: "auto" }}
            />
          </View>
          <View style={styles.directionsView}>
            <MatComIcon name="arrow-right-top" color="white" size={24} />
            <Text
              style={{
                color: "white",
                fontFamily: "Inter-Medium",
                marginLeft: 5,
              }}
            >
              Get Directions
            </Text>
          </View>
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
            <Feather name="minus-circle" color={colors.primary} size={24} />
            <Text
              style={[
                styles.labelText,
                { fontSize: 18, marginHorizontal: 10, color: "white" },
              ]}
            >
              6
            </Text>
            <Feather name="plus-circle" color={colors.primary} size={24} />
          </View>
        </View>
        <View style={styles.contentView}>
          <View style={styles.contentRow}>
            <Text style={styles.labelText}>Date</Text>
            <View style={styles.contentIconView}>
              <Text style={[styles.valueText, { marginRight: 10 }]}>
                {new Date(JSON.parse(bookingDetails.date))
                  .toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                  .slice(0, -6)}
              </Text>
              <Feather name="edit-3" color={"white"} size={16} />
            </View>
          </View>
          <View style={styles.contentRow}>
            <Text style={styles.labelText}>Time slot</Text>
            <View style={styles.contentIconView}>
              <Text style={[styles.valueText, { marginRight: 10 }]}>
                {bookingDetails.startTime} - {bookingDetails.endTime}
              </Text>
              <Feather name="edit-3" color={"white"} size={16} />
            </View>
          </View>
        </View>
        <View style={styles.contentView}>
          <View style={styles.contentRow}>
            <Text style={styles.labelText}>Venue Price</Text>
            <Text
              style={[
                styles.valueText,
                { marginRight: 10, color: colors.tertiary },
              ]}
            >
              USD {price}
            </Text>
          </View>
          <View style={styles.contentRow}>
            <Text style={styles.labelText}>Service Price</Text>
            <Text
              style={[
                styles.valueText,
                { marginRight: 10, color: colors.tertiary },
              ]}
            >
              USD ??
            </Text>
          </View>
          <View style={styles.contentRow}>
            <Text style={[styles.labelText, { color: "white" }]}>Total</Text>
            <Text style={[styles.valueText, { marginRight: 10 }]}>
              USD {price}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.paymentView}
          onPress={() => {
            const bookingDate = new Date(JSON.parse(bookingDetails.date));
            createGame({
              courtId: bookingDetails.courtId,
              timeSlotIds: bookingDetails.timeSlotIds,
              date: bookingDate,
              type: bookingDetails.gameType,
            });
          }}
        >
          <View>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 10 }}>
              TOTAL
            </Text>
            <Text style={{ fontFamily: "Inter-Medium" }}>USD 24.20</Text>
          </View>
          <Text style={{ fontFamily: "Inter-SemiBold" }}>
            Continue To Payment
          </Text>
        </TouchableOpacity>
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
      paddingBottom: 20,
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
    directionsView: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 20,
      paddingBottom: 10,
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
    paymentView: {
      height: 65,
      backgroundColor: colors.primary,
      marginTop: "auto",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
    },
  });
