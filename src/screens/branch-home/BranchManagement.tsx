import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { VenueBottomTabParamList } from "src/navigation";
import { UserContext } from "src/utils";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useCourtsInBranchQuery } from "src/api";
import { BranchLocation, BranchLocationSkeleton } from "src/components";
import { CreateCourt } from "./CreateCourt";

type Props = BottomTabScreenProps<VenueBottomTabParamList>;

export const BranchManagement = ({
  navigation,
  route,
  setSignedIn,
}: Props & {
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>;
}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { venueData, setVenueData } = useContext(UserContext);

  const [createCourtVisible, setCreateCourtVisible] = useState<boolean>(false);

  const { data: courtsInBranch, isLoading: courtsLoading } =
    useCourtsInBranchQuery(venueData?.branchId);

  return (
    <Fragment>
      <View style={styles.wrapper}>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              variant="labelLarge"
              style={{ color: colors.tertiary, fontSize: 20 }}
            >
              Courts
            </Text>
            <TouchableOpacity
              onPress={() => {
                AsyncStorage.clear();
                if (setSignedIn) setSignedIn(null);
                setVenueData(null);
              }}
            >
              <IonIcon name="log-out-outline" color="white" size={24} />
            </TouchableOpacity>
          </View>
          {courtsLoading && <BranchLocationSkeleton />}
          {!courtsLoading &&
            courtsInBranch?.map((court, index: number) => (
              <BranchLocation
                key={index}
                type="court"
                court={court}
                isBranchAccount
              />
            ))}
          {!courtsLoading &&
            (!courtsInBranch || courtsInBranch.length === 0) && (
              <Text style={styles.placeholderText}>
                You have not assigned any courts yet.
              </Text>
            )}
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
      </View>
      <CreateCourt
        visible={createCourtVisible}
        setVisible={setCreateCourtVisible}
      />
    </Fragment>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    wrapper: {
      flexGrow: 1,
      backgroundColor: colors.background,
      paddingHorizontal: "7%",
      paddingTop: 60,
      paddingBottom: 20,
    },
    placeholderText: {
      height: 50,
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
      textAlignVertical: "center",
    },
  });
