import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { BottomTabParamList, StackParamList } from "src/navigation";
import { GameType, Branch, TimeSlot } from "src/types";
import { Skeleton } from "./Skeleton";

type styleOptions = "vertical" | "horizontal" | "focused";

export const BranchCardSkeleton = ({ type }: { type: styleOptions }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors, type === "horizontal", type === "focused");

  return (
    <View
      style={[styles.wrapper, type === "vertical" ? { marginLeft: 20 } : {}]}
    >
      <Skeleton style={styles.image} />
      <View style={styles.content}>
        <Skeleton
          style={{ width: 35, height: 35, aspectRatio: 1, borderRadius: 18 }}
        />
        <View style={styles.textView}>
          <Skeleton height={20} width={"100%"} />
          <View style={styles.ratingView}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
                marginRight: 5,
              }}
            >
              <IonIcon name={"star"} color={colors.primary} />
              <Skeleton height={15} width={30} style={{ marginLeft: 5 }} />
            </View>
            <Skeleton height={15} width={100} style={{ marginTop: 5 }} />
          </View>
        </View>
      </View>
    </View>
  );
};

export const BranchCard = ({
  type,
  promoted = true,
  branch,
  playScreenBookingDetails,
  isFirst,
  isLast,
}: {
  type: styleOptions;
  promoted?: boolean;
  branch: Branch;
  playScreenBookingDetails?: {
    date: string;
    time?: TimeSlot;
    gameType: GameType;
    nbOfPlayers: number;
  };
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors, type === "horizontal", type === "focused");
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<StackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.wrapper,
        isFirst ? { marginLeft: 20 } : {},
        isLast ? { marginRight: 20 } : {},
      ]}
      onPress={() => {
        navigation.push("BranchDetails", {
          id: branch.id,
          playScreenBookingDetails,
        });
      }}
    >
      <Image
        source={
          branch?.coverPhotoUrl
            ? { uri: branch.coverPhotoUrl }
            : require("assets/images/home/basketball-hub.png")
        }
        style={styles.image}
      />
      <View style={styles.content}>
        {promoted && (
          <View style={styles.promotedView}>
            <Text style={styles.promoted}>Promoted</Text>
          </View>
        )}
        {branch?.profilePhotoUrl && (
          <Image
            source={{
              uri: branch?.profilePhotoUrl,
            }}
            style={{ width: 35, aspectRatio: 1 }}
          />
        )}
        <View style={styles.textView}>
          <Text style={styles.title}>{branch.venue.name}</Text>
          <View style={styles.ratingView}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IonIcon name={"star"} color={colors.primary} />
              <Text style={styles.rating}>{branch.rating}</Text>
            </View>
            <Text style={styles.location}>
              {type !== "horizontal" && " • "}
              {branch.location}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (
  colors: MD3Colors,
  isHorizontal: boolean,
  isFocused: boolean
) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: isHorizontal ? "row" : "column",
      justifyContent: "flex-end",
      marginHorizontal: isHorizontal || isFocused ? 0 : 5,
      marginBottom: isHorizontal || isFocused ? 20 : 0,
      borderRadius: 10,
      minWidth: isHorizontal ? "auto" : 200,
    },
    image: {
      height: isHorizontal ? "100%" : 128,
      width: isHorizontal ? "50%" : "100%",
      borderTopLeftRadius: 10,
      borderTopRightRadius: isHorizontal ? 0 : 10,
      borderBottomLeftRadius: isHorizontal ? 10 : 0,
    },
    content: {
      flex: 1,
      flexDirection: isHorizontal ? "column" : "row",
      backgroundColor: colors.secondary,
      padding: 15,
      borderBottomLeftRadius: isHorizontal ? 0 : 10,
      borderBottomRightRadius: 10,
      borderTopRightRadius: isHorizontal ? 10 : 0,
    },
    promotedView: {
      position: "absolute",
      top: isFocused ? 10 : -26,
      right: isFocused ? 10 : 5,
      backgroundColor: colors.secondary,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 20,
      opacity: 0.9,
      borderWidth: isFocused ? 1 : 0,
      borderColor: colors.primary,
    },
    promoted: {
      color: isFocused ? colors.primary : colors.tertiary,
      fontSize: isFocused ? 12 : 10,
      fontFamily: "Poppins-Bold",
    },
    textView: {
      paddingHorizontal: isHorizontal ? 0 : 10,
      paddingTop: isHorizontal ? 10 : 0,
    },
    title: {
      color: "white",
      fontFamily: "Poppins-Bold",
    },
    ratingView: {
      flexDirection: isHorizontal ? "column" : "row",
      alignItems: isHorizontal ? "flex-start" : "center",
    },
    rating: {
      color: "white",
      fontFamily: "Poppins-Regular",
      fontSize: 12,
      marginLeft: 5,
      paddingVertical: isHorizontal ? 5 : 0,
    },
    location: {
      color: colors.tertiary,
      fontFamily: "Poppins-Regular",
      fontSize: 12,
      lineHeight: 20,
    },
  });
