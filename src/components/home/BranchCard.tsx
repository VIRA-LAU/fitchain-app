import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import IonIcon from "react-native-vector-icons/Ionicons";
import { BottomTabParamList, HomeStackParamList } from "src/navigation";
import { Branch, TimeSlot } from "src/types";
import { Skeleton } from "./Skeleton";
import { GameType } from "src/enum-types";

type styleOptions = "vertical" | "horizontal" | "focused";

export const BranchCardSkeleton = ({ type }: { type: styleOptions }) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors, type === "horizontal", type === "focused");

  return (
    <View style={styles.wrapper}>
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
  price,
  disabled = false,
}: {
  type: styleOptions;
  promoted?: boolean;
  branch: Branch;
  price?: string;
  playScreenBookingDetails?: {
    date: string;
    time?: TimeSlot;
    gameType: GameType;
    nbOfPlayers: number;
  };
  disabled?: boolean;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors, type === "horizontal", type === "focused");
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  return (
    <TouchableRipple
      borderless
      style={styles.wrapper}
      disabled={disabled}
      onPress={() => {
        navigation.push("BranchDetails", {
          id: branch.id,
          playScreenBookingDetails,
        });
      }}
    >
      <View style={styles.wrapperContent}>
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
              <View style={{ flexDirection: "row" }}>
                <IonIcon
                  name={"star"}
                  color={colors.primary}
                  size={16}
                  style={{ paddingTop: 2 }}
                />
                <Text style={styles.rating}>{branch.rating?.toFixed(1)}</Text>
              </View>
              {type === "horizontal" && (
                <Text style={styles.location}>{price} $/hour</Text>
              )}
              <Text style={[styles.location, { color: "#9E9E9E" }]}>
                {type !== "horizontal" && " • "}
                {branch.location}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

const makeStyles = (
  colors: MD3Colors,
  isHorizontal: boolean,
  isFocused: boolean
) =>
  StyleSheet.create({
    wrapper: {
      borderRadius: 12,
      minWidth: isHorizontal ? "auto" : 200,
    },
    wrapperContent: {
      flexDirection: isHorizontal ? "row" : "column",
      justifyContent: "flex-end",
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
      padding: 12,
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
      color: colors.tertiary,
      fontFamily: "Poppins-Bold",
    },
    ratingView: {
      flexDirection: isHorizontal ? "column" : "row",
      alignItems: isHorizontal ? "flex-start" : "center",
    },
    rating: {
      color: colors.primary,
      fontFamily: "Poppins-Regular",
      marginLeft: 5,
      height: "100%",
      textAlignVertical: "bottom",
    },
    location: {
      color: colors.tertiary,
      fontFamily: "Poppins-Regular",
    },
  });
