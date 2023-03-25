import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, StyleSheet, View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { BottomTabParamList, HomeStackParamList } from "navigation";
import FeatherIcon from "react-native-vector-icons/Feather";
import { GameType } from "src/types";

export const CourtCard = ({
  id,
  venueName,
  type,
  // rating,
  price,
  bookingDetails,
  onPress,
}: {
  id: number;
  venueName: string;
  type: string;
  // rating: number;
  price: number;
  bookingDetails?: {
    date: string;
    duration: number;
    gameType: GameType;
  };
  onPress: Function;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        StackNavigationProp<HomeStackParamList>,
        BottomTabNavigationProp<BottomTabParamList>
      >
    >();

  return (
    <Pressable style={styles.wrapperView} onPress={() => onPress()}>
      <View style={styles.contentView}>
        <Image
          style={styles.courtImage}
          source={require("assets/images/home/basketball-court-icon.png")}
        />
        <View
          style={{
            justifyContent: "space-between",
            height: "70%",
            flexGrow: 1,
          }}
        >
          <View style={styles.rowView}>
            <Text variant="labelLarge" style={styles.courtType}>
              {type}
            </Text>
            <View style={styles.rating}>
              <FeatherIcon name={`star`} color={"white"} size={14} />
              <Text style={styles.title}>3.6</Text>
            </View>
          </View>

          <View style={styles.rowView}>
            <Text style={styles.subtitle}>TYPE</Text>
            <Text style={styles.rowValue}>{type}</Text>
          </View>
          <View style={styles.rowView}>
            <Text style={styles.subtitle}>PRICE</Text>
            <Text style={styles.rowValue}>USD {price}/hr</Text>
          </View>
        </View>
      </View>
      <View style={styles.lineStyle} />
    </Pressable>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      alignItems: "center",
      height: 100,
    },
    rating: {
      flexDirection: "row",
      alignItems: "center",
    },
    lineStyle: {
      borderWidth: 0.3,
      borderColor: colors.tertiary,
      width: "100%",
    },
    courtType: {
      color: "white",
    },
    courtImage: {
      height: 75,
      width: 75,
      borderRadius: 10,
      marginLeft: 10,
    },
    contentView: {
      height: 100,
      flexGrow: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    titleView: { marginLeft: 10 },
    icon: {
      flex: 1,
      alignItems: "center",
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 15,
    },
    title: {
      color: "white",
      fontFamily: "Inter-Medium",
      marginLeft: 5,
    },
    subtitle: {
      color: colors.tertiary,
      fontFamily: "Inter-Medium",
      fontSize: 12,
    },
    rowValue: {
      color: "white",
      fontFamily: "Inter-Medium",
      fontSize: 10,
    },
  });
