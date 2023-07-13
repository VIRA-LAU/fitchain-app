import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { BottomTabParamList, HomeStackParamList } from "navigation";
import { Court, GameType } from "src/types";
import FeatherIcon from "react-native-vector-icons/Feather";
import { MiniMapComponent, Skeleton } from "../home";

export const BranchLocationSkeleton = () => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.wrapperView}>
      <Skeleton style={styles.background} />
      <View style={styles.dataView}>
        <View style={styles.headerView}>
          <Skeleton style={{ width: 35, aspectRatio: 1, marginRight: 10 }} />
          <View>
            <Skeleton height={15} width={120} style={styles.title} />
            <Skeleton
              height={15}
              width={60}
              style={[styles.subtitle, { marginTop: 5 }]}
            />
          </View>
        </View>
        <View style={styles.rowView}>
          <Skeleton height={15} width={80} style={styles.rowKey} />
          <Skeleton height={15} width={80} style={styles.rowValue} />
        </View>

        <View style={styles.rowView}>
          <Skeleton height={15} width={80} style={styles.rowKey} />
          <Skeleton height={15} width={80} style={styles.rowValue} />
        </View>
      </View>
    </View>
  );
};

export const BranchLocation = ({
  type,
  court,
  branch,
  team,
}: {
  type: "branch" | "court";
  court?: Court;
  branch?: {
    id: number;
    venueName: string;
    location: string;
    courts: Court[];
    rating: number;
    latitude: number;
    longitude: number;
    profilePhotoUrl?: string;
  };
  team?: "Home" | "Away";
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  let courtsStr = "";
  let prices = "null";
  if (branch) {
    const pricesArr = branch?.courts.map(({ price }) => price);
    if (pricesArr.length > 0)
      prices =
        pricesArr?.length === 1
          ? pricesArr[0].toString()
          : `${Math.min.apply(null, pricesArr!)} - ${Math.max.apply(
              null,
              pricesArr!
            )}`;

    courtsStr =
      branch.courts.length > 0
        ? branch.courts.map(({ courtType }) => courtType).join(", ")
        : "None";
  }

  return (
    <View style={[styles.wrapperView]}>
      <View style={styles.background}>
        {branch && (
          <MiniMapComponent
            locationMarker={{
              latitude: branch.latitude,
              longitude: branch.longitude,
            }}
          />
        )}
        {court && (
          <MiniMapComponent
            locationMarker={{
              latitude: court.branch.latitude,
              longitude: court.branch.longitude,
            }}
          />
        )}
      </View>
      <View style={styles.dataView}>
        <View style={styles.headerView}>
          {(branch?.profilePhotoUrl || court?.branch.profilePhotoUrl) && (
            <Image
              source={{
                uri: branch?.profilePhotoUrl || court?.branch.profilePhotoUrl,
              }}
              style={{ width: 35, aspectRatio: 1, marginRight: 10 }}
            />
          )}
          <View>
            <Text style={styles.title}>
              {type === "court" ? court?.branch.venue.name : branch?.location}
            </Text>
            {type === "court" && (
              <Text style={styles.subtitle}>
                {type === "court" && court?.branch.location}
              </Text>
            )}
          </View>
          {type === "branch" && (
            <FeatherIcon
              name={"star"}
              color={"white"}
              size={14}
              style={{ marginLeft: "auto", marginRight: 5 }}
            />
          )}
          {type === "branch" && (
            <View>
              <Text style={styles.title}>{branch?.rating}</Text>
            </View>
          )}
        </View>
        {type === "court" && (
          <View style={styles.rowView}>
            <Text style={styles.rowKey}>COURT</Text>
            <Text style={styles.rowValue}>{court?.name}</Text>
          </View>
        )}
        {type === "court" && (
          <View style={styles.rowView}>
            <Text style={styles.rowKey}>SIDE</Text>
            <Text style={styles.rowValue}>{team}</Text>
          </View>
        )}
        {type === "court" && (
          <View style={styles.rowView}>
            <Text style={styles.rowKey}>PRICE</Text>
            <Text style={styles.rowValue}>USD {court?.price}/hr</Text>
          </View>
        )}
        {type === "branch" && (
          <View style={styles.rowView}>
            <Text style={styles.rowKey}>COURTS</Text>
            <Text style={styles.rowValue}>{courtsStr}</Text>
          </View>
        )}
        {type === "branch" && (
          <View style={styles.rowView}>
            <Text style={styles.rowKey}>PRICE</Text>
            <Text style={styles.rowValue}>USD {prices}/hr</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapperView: {
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    background: {
      position: "absolute",
      height: "100%",
      width: "100%",
      borderRadius: 10,
    },
    dataView: {
      width: "60%",
      margin: 10,
      backgroundColor: colors.secondary,
      borderRadius: 10,
      padding: 10,
    },
    headerView: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 5,
    },
    icon: {
      flex: 1,
      alignItems: "center",
    },
    rowView: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 2,
    },
    title: {
      color: "white",
      fontFamily: "Inter-Medium",
    },
    subtitle: {
      color: colors.tertiary,
      fontFamily: "Inter-Medium",
      fontSize: 12,
    },
    rowKey: {
      color: colors.tertiary,
      fontFamily: "Inter-Medium",
      fontSize: 10,
    },
    rowValue: {
      color: "white",
      fontFamily: "Inter-Medium",
      fontSize: 10,
    },
  });
