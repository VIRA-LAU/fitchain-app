import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useState,
} from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { VenueBottomTabParamList } from "src/navigation";
import { UserContext } from "src/utils";
import IonIcon from "react-native-vector-icons/Ionicons";
import {
  useBranchByIdQuery,
  useCourtsInBranchQuery,
  useVenueByIdQuery,
} from "src/api";
import {
  AppHeader,
  BranchLocation,
  BranchLocationSkeleton,
  CourtCard,
  Skeleton,
} from "src/components";
import { CreateCourt } from "./CreateCourt";

type Props = BottomTabScreenProps<VenueBottomTabParamList>;

export const BranchManagement = ({
  navigation,
  route,
  setSignedIn,
  setCreateCourtVisible,
}: Props & {
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>;
  setCreateCourtVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const { colors } = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const styles = makeStyles(colors, windowWidth, windowHeight);
  const { venueData, setVenueData } = useContext(UserContext);

  const { data: branchDetails, isLoading: branchDetailsLoading } =
    useBranchByIdQuery(venueData?.branchId);

  const { data: venueDetails, isLoading: detailsLoading } = useVenueByIdQuery(
    venueData?.venueId
  );

  const { data: courtsInBranch, isLoading: courtsLoading } =
    useCourtsInBranchQuery(venueData?.branchId);

  return (
    <AppHeader
      navigation={navigation}
      route={route}
      right={
        <TouchableOpacity
          onPress={() => {
            AsyncStorage.clear();
            if (setSignedIn) setSignedIn(null);
            setVenueData(null);
          }}
        >
          <IonIcon name="log-out-outline" color="white" size={24} />
        </TouchableOpacity>
      }
      title={venueData?.venueName}
      backEnabled
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.headerView}>
          <Image
            source={require("assets/images/home/basketball-hub.png")}
            style={styles.headerImage}
          />
          <View style={styles.headerContent}>
            <Image
              source={require("assets/images/home/basketball-hub-icon.png")}
              style={styles.clubIcon}
            />
            {detailsLoading ? (
              <Skeleton height={20} width={180} style={styles.headerText} />
            ) : (
              <Text style={styles.headerText}>{venueDetails?.description}</Text>
            )}
          </View>
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <Text
            variant="labelLarge"
            style={{ color: colors.tertiary, marginBottom: 20 }}
          >
            Your Branch
          </Text>
          {branchDetails && (
            <BranchLocation
              type="branch"
              branch={{
                venueName: venueData?.venueName!,
                latitude: branchDetails.latitude,
                longitude: branchDetails.longitude,
                location: branchDetails.location,
                courts: branchDetails.courts,
                rating: branchDetails.rating,
              }}
              isBranchAccount
            />
          )}
          <Text
            variant="labelLarge"
            style={{ color: colors.tertiary, marginVertical: 20 }}
          >
            Your Courts
          </Text>
          {courtsLoading && <BranchLocationSkeleton />}
          <View style={{ marginHorizontal: -20 }}>
            {!courtsLoading &&
              courtsInBranch?.map((court, index: number) => (
                <CourtCard
                  key={index}
                  name={court.name}
                  price={court.price}
                  rating={court.rating}
                  type={court.courtType}
                  venueName={venueData?.venueName!}
                  onPress={() => {}}
                />
              ))}
          </View>
          {!courtsLoading &&
            (!courtsInBranch || courtsInBranch.length === 0) && (
              <Text style={styles.placeholderText}>
                You have not assigned any courts yet.
              </Text>
            )}
        </View>
      </ScrollView>
      <IconButton
        icon={"plus"}
        iconColor="white"
        containerColor={colors.primary}
        size={40}
        style={{ position: "absolute", right: 20, bottom: 20 }}
        onPress={() => {
          setCreateCourtVisible(true);
        }}
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
    wrapper: {
      flexGrow: 1,
      backgroundColor: colors.background,
      paddingHorizontal: "7%",
      paddingTop: 60,
      paddingBottom: 20,
    },
    headerView: {
      backgroundColor: colors.secondary,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
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
    clubIcon: {
      width: 0.33 * windowWidth,
      height: 0.33 * windowWidth,
      marginTop: (-0.33 * windowWidth) / 2,
    },
    headerText: {
      fontFamily: "Inter-Medium",
      lineHeight: 20,
      color: "white",
      marginTop: 5,
      marginBottom: 15,
      textAlign: "center",
    },
    placeholderText: {
      height: 50,
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
      textAlignVertical: "center",
    },
  });
