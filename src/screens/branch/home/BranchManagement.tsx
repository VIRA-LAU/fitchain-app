import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { BranchBottomTabParamList } from "src/navigation";
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
  ImageList,
  SelectionModal,
  Skeleton,
} from "src/components";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { TimeSlot } from "src/types";
import { GameType } from "src/enum-types";

type Props = BottomTabScreenProps<BranchBottomTabParamList>;

export type existingCourtType = {
  courtId: number;
  name: string;
  price: string;
  courtType: GameType;
  numOfPlayers: number;
  timeSlots: TimeSlot[];
};
export var courtToEdit: MutableRefObject<existingCourtType | undefined>;

export const BranchManagement = ({
  navigation,
  route,
  setCreateCourtVisible,
}: Props & {
  setCreateCourtVisible: Dispatch<SetStateAction<"create" | "edit" | false>>;
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const styles = makeStyles(colors, windowWidth, windowHeight);
  const { branchData, setBranchData } = useContext(UserContext);

  courtToEdit = useRef<existingCourtType>();

  const [modalVisible, setModalVisible] = useState(false);
  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [coverPhotoToUpload, setCoverPhotoToUpload] = useState<string>();
  const [profilePhotoToUpload, setProfilePhotoToUpload] = useState<string>();

  const { data: branchDetails, isLoading: branchDetailsLoading } =
    useBranchByIdQuery(branchData?.branchId);

  const { data: venueDetails, isLoading: venueDetailsLoading } =
    useVenueByIdQuery(branchData?.venueId);

  const { data: courtsInBranch } = useCourtsInBranchQuery(branchData?.branchId);

  const { mutate: updateBranch, isLoading: updateLoading } =
    useUpdateBranchMutation();

  useEffect(() => {
    const handleBack = () => {
      if (isEditing) {
        setIsEditing(false);
        return true;
      } else return false;
    };
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, [isEditing]);

  return (
    <AppHeader
      right={
        !branchDetailsLoading ? (
          isEditing ? (
            <TouchableOpacity
              onPress={() => {
                setIsEditing(false);
                setModalVisible(false);
              }}
            >
              <IonIcon
                name="checkmark-sharp"
                color={colors.primary}
                size={24}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <IonIcon
                name="ellipsis-horizontal"
                color={colors.tertiary}
                size={24}
              />
            </TouchableOpacity>
          )
        ) : (
          <View />
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
            {!branchDetailsLoading ? (
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
            ) : (
              <View
                style={[
                  styles.headerImage,
                  { backgroundColor: colors.background },
                ]}
              />
            )}
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
            <View
              style={{
                marginTop: (-0.33 * windowWidth) / 2,
              }}
            >
              {!branchDetailsLoading ? (
                profilePhotoToUpload ? (
                  <Image
                    source={{ uri: profilePhotoToUpload }}
                    style={styles.profilePhoto}
                  />
                ) : branchDetails?.profilePhotoUrl ? (
                  <Image
                    source={{ uri: branchDetails.profilePhotoUrl }}
                    style={styles.profilePhoto}
                  />
                ) : (
                  <View
                    style={{
                      ...styles.profilePhoto,
                      backgroundColor: colors.background,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 100,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 16,
                        color: colors.tertiary,
                        textAlign: "center",
                        margin: 10,
                      }}
                    >
                      {branchData?.venueName}
                    </Text>
                  </View>
                )
              ) : (
                <Skeleton
                  style={{
                    width: 0.33 * windowWidth,
                    aspectRatio: 1,
                  }}
                />
              )}
              {isEditing && (
                <TouchableOpacity
                  onPress={() =>
                    uploadImage(
                      "branch",
                      "profile",
                      branchData?.branchId,
                      setPermissionDialogVisible,
                      setProfilePhotoToUpload,
                      updateBranch
                    )
                  }
                  activeOpacity={0.8}
                  style={styles.editImage}
                >
                  <MaterialIcon
                    name="camera-alt"
                    size={28}
                    color={colors.tertiary}
                  />
                </TouchableOpacity>
              )}
            </View>
            {venueDetailsLoading ? (
              <Skeleton height={20} width={180} style={styles.headerText} />
            ) : venueDetails?.description ? (
              <Text style={styles.headerText}>{venueDetails?.description}</Text>
            ) : (
              <View style={{ marginVertical: 15 }} />
            )}
          </View>
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <Text
            variant="labelLarge"
            style={{ color: colors.tertiary, marginBottom: 20 }}
          >
            Branch
          </Text>
          {branchDetailsLoading && <BranchLocationSkeleton />}
          {!branchDetailsLoading && branchDetails && (
            <BranchLocation
              type="branch"
              branch={{
                id: branchData?.branchId!,
                venueName: branchData?.venueName!,
                latitude: branchDetails.latitude!,
                longitude: branchDetails.longitude!,
                location: branchDetails.location!,
                courts: branchDetails.courts,
                rating: branchDetails.rating!,
                profilePhotoUrl: branchDetails.profilePhotoUrl,
              }}
            />
          )}
          <Text
            variant="labelLarge"
            style={{ color: colors.tertiary, marginVertical: 20 }}
          >
            Courts
          </Text>
          <View style={{ marginHorizontal: -20 }}>
            {courtsInBranch?.map((court, index: number) => (
              <CourtCard
                key={index}
                name={court.name}
                price={court.price}
                rating={court.rating!}
                type={court.courtType}
                venueName={branchData?.venueName!}
                onPress={() => {
                  courtToEdit.current = {
                    courtId: court.id,
                    name: court.name,
                    courtType: court.courtType,
                    price: court.price.toString(),
                    numOfPlayers: court.nbOfPlayers!,
                    timeSlots: court.timeSlots!,
                  };
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
        <View style={{ marginHorizontal: 20 }}>
          <ImageList
            images={branchDetails?.branchPhotoUrl}
            isLoading={branchDetailsLoading || updateLoading}
            editable
          />
        </View>
      </ScrollView>
      <IconButton
        icon={"plus"}
        iconColor={colors.tertiary}
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
    profilePhoto: {
      backgroundColor: "transparent",
      width: 0.33 * windowWidth,
      aspectRatio: 1,
    },
    headerText: {
      fontFamily: "Poppins-Regular",
      lineHeight: 20,
      color: colors.tertiary,
      marginVertical: 15,
      textAlign: "center",
    },
    placeholder: {
      height: 50,
      justifyContent: "center",
    },
    placeholderText: {
      fontFamily: "Poppins-Regular",
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
