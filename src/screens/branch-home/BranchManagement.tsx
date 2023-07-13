import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Dispatch, SetStateAction, useContext, useState } from "react";
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
import { UserContext, uploadImage } from "src/utils";
import IonIcon from "react-native-vector-icons/Ionicons";
import {
  useBranchByIdQuery,
  useCourtsInBranchQuery,
  useUpdateBranchMutation,
  useVenueByIdQuery,
} from "src/api";
import {
  AppHeader,
  BranchLocation,
  BranchLocationSkeleton,
  CourtCard,
  GalleryPermissionDialog,
  SelectionModal,
  Skeleton,
} from "src/components";
import { existingCourtType } from "./CreateCourt";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

type Props = BottomTabScreenProps<VenueBottomTabParamList>;

export const BranchManagement = ({
  navigation,
  route,
  setCreateCourtVisible,
  setCourtInfo,
}: Props & {
  setCreateCourtVisible: Dispatch<SetStateAction<"create" | "edit" | false>>;
  setCourtInfo: Dispatch<SetStateAction<existingCourtType | undefined>>;
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const styles = makeStyles(colors, windowWidth, windowHeight);
  const { branchData, setBranchData } = useContext(UserContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [coverPhotoToUpload, setCoverPhotoToUpload] = useState<string>();

  const { data: branchDetails, isLoading: branchDetailsLoading } =
    useBranchByIdQuery(branchData?.branchId);

  const { data: venueDetails, isLoading: venueDetailsLoading } =
    useVenueByIdQuery(branchData?.venueId);

  const { data: courtsInBranch } = useCourtsInBranchQuery(branchData?.branchId);

  const { mutate: updateBranch } = useUpdateBranchMutation();

  return (
    <AppHeader
      navigation={navigation}
      route={route}
      right={
        isEditing ? (
          <TouchableOpacity
            onPress={() => {
              setIsEditing(false);
              setModalVisible(false);
            }}
          >
            <IonIcon name="checkmark-sharp" color={colors.primary} size={24} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <IonIcon name="ellipsis-horizontal" color={"white"} size={24} />
          </TouchableOpacity>
        )
      }
      title={branchData?.venueName}
      backEnabled
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <GalleryPermissionDialog
          visible={permissionDialogVisible}
          setVisible={setPermissionDialogVisible}
        />
        <SelectionModal
          visible={modalVisible}
          setVisible={setModalVisible}
          options={[
            {
              text: "Edit Branch",
              onPress: () => {
                setModalVisible(false);
                setIsEditing(true);
              },
            },
            {
              text: "Sign Out",
              onPress: () => {
                setModalVisible(false);
                setBranchData(null);
              },
            },
          ]}
        />
        <View style={styles.headerView}>
          <View>
            <Image
              source={
                coverPhotoToUpload
                  ? { uri: coverPhotoToUpload }
                  : branchDetails?.coverPhotoUrl
                  ? {
                      uri: branchDetails.coverPhotoUrl,
                    }
                  : require("assets/images/home/basketball-hub.png")
              }
              style={styles.headerImage}
            />
            {isEditing && (
              <TouchableOpacity
                onPress={() =>
                  uploadImage(
                    "branch",
                    "cover",
                    branchData?.branchId,
                    setPermissionDialogVisible,
                    setCoverPhotoToUpload,
                    updateBranch
                  )
                }
                activeOpacity={0.8}
                style={[
                  styles.editImage,
                  {
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  },
                ]}
              >
                <MaterialIcon
                  name="image"
                  size={28}
                  color={colors.tertiary}
                  style={{ marginRight: 20, marginBottom: 20 }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.headerContent}>
            <Image
              source={require("assets/images/home/basketball-hub-icon.png")}
              style={styles.clubIcon}
            />
            {venueDetailsLoading ? (
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
          {branchDetailsLoading && <BranchLocationSkeleton />}
          {branchDetails && (
            <BranchLocation
              type="branch"
              branch={{
                id: branchData?.branchId!,
                venueName: branchData?.venueName!,
                latitude: branchDetails.latitude,
                longitude: branchDetails.longitude,
                location: branchDetails.location,
                courts: branchDetails.courts,
                rating: branchDetails.rating,
              }}
            />
          )}
          <Text
            variant="labelLarge"
            style={{ color: colors.tertiary, marginVertical: 20 }}
          >
            Your Courts
          </Text>
          <View style={{ marginHorizontal: -20 }}>
            {courtsInBranch?.map((court, index: number) => (
              <CourtCard
                key={index}
                name={court.name}
                price={court.price}
                rating={court.rating}
                type={court.courtType}
                venueName={branchData?.venueName!}
                onPress={() => {
                  setCourtInfo({
                    courtId: court.id,
                    name: court.name,
                    courtType: court.courtType,
                    price: court.price.toString(),
                    numOfPlayers: court.nbOfPlayers,
                    selectedTimeSlots: court.courtTimeSlots.map(
                      (slot) => slot.timeSlotId
                    ),
                  });
                  setCreateCourtVisible("edit");
                }}
              />
            ))}
          </View>
          {(!courtsInBranch || courtsInBranch.length === 0) && (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                You have not assigned any courts yet.
              </Text>
            </View>
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
          setCreateCourtVisible("create");
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
    placeholder: {
      height: 50,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
    },
    editImage: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      top: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });
