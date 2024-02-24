import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { getMins, parseTimeFromMinutes } from "src/components";
import FeatherIcon from "react-native-vector-icons/Feather";
import { GameCreationType } from "./CreateGame";

export const Confirmation = ({
  gameDetails,
}: {
  gameDetails: GameCreationType;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { searchDate, branch, court, startTime, duration } = gameDetails;

  const startDate = new Date(searchDate);
  startDate.setHours(parseInt(startTime.substring(0, 2)));
  startDate.setMinutes(parseInt(startTime.substring(3, 5)));

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + duration * 60);

  return (
    <ScrollView
      style={{ margin: -16 }}
      contentContainerStyle={styles.wrapperView}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={require("assets/images/home/basketball-court-icon.png")}
          />
          <View style={styles.headerContentInfo}>
            <Text
              style={{ color: colors.primary, fontFamily: "Poppins-Medium" }}
            >
              {court?.name}
            </Text>
            <Text style={styles.headerContentText}>{gameDetails.gameType}</Text>
            <View style={styles.rating}>
              <FeatherIcon
                name={`star`}
                color={colors.tertiary}
                size={16}
                style={{ paddingBottom: 3 }}
              />
              <Text style={[styles.headerContentText, { marginLeft: 5 }]}>
                {court?.rating?.toFixed(1)}
              </Text>
            </View>
          </View>
          {branch?.profilePhotoUrl && (
            <Image
              source={{
                uri: branch?.profilePhotoUrl,
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
      <View style={styles.contentView}>
        <View style={styles.contentRow}>
          <Text style={styles.labelText}>Date</Text>
          <View style={styles.contentIconView}>
            <Text style={[styles.valueText, { marginRight: 10 }]}>
              {startDate
                .toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
                .slice(0, Platform.OS === "ios" ? -5 : -6)}
            </Text>
          </View>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.labelText}>Time slot</Text>
          <View style={styles.contentIconView}>
            <Text style={[styles.valueText, { marginRight: 10 }]}>
              {parseTimeFromMinutes(getMins(startDate))} -{" "}
              {parseTimeFromMinutes(getMins(endDate))}
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
            USD {court?.price}/hr
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
            {duration}
          </Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={[styles.labelText, { color: colors.tertiary }]}>
            Total
          </Text>
          <Text style={[styles.valueText, { marginRight: 10 }]}>
            USD {court?.price ?? 0 * duration}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      flexGrow: 1,
      gap: 16,
    },
    header: {
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
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 16,
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
  });
