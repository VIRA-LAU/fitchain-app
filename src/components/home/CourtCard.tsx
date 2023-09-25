import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import FeatherIcon from "react-native-vector-icons/Feather";

export const CourtCard = ({
  type,
  price,
  rating,
  onPress,
  name,
}: {
  venueName: string;
  type: string;
  price: number;
  name: string;
  rating: number;
  onPress: Function;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.wrapperView}
      onPress={() => onPress()}
    >
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
              {name}
            </Text>
            <View style={styles.rating}>
              <FeatherIcon name={`star`} color={colors.tertiary} size={14} />
              <Text style={styles.title}>{rating.toFixed(1)}</Text>
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
    </TouchableOpacity>
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
      borderWidth: 0.4,
      borderColor: colors.tertiary,
      width: "100%",
    },
    courtType: {
      color: colors.tertiary,
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
      color: colors.tertiary,
      fontFamily: "Poppins-Regular",
      marginLeft: 5,
    },
    subtitle: {
      color: colors.tertiary,
      fontFamily: "Poppins-Regular",
      fontSize: 12,
    },
    rowValue: {
      color: colors.tertiary,
      fontFamily: "Poppins-Regular",
      fontSize: 10,
    },
  });
