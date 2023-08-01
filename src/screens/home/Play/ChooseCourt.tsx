import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { StackParamList } from "navigation";
import { AppHeader } from "src/components";
import { ScrollView } from "react-native-gesture-handler";
import { CourtCard, TimeSlotPicker } from "src/components";
import { useState } from "react";
import { Court, TimeSlot } from "src/types";
import { useSearchBranchesQuery } from "src/api";

type Props = StackScreenProps<StackParamList, "ChooseCourt">;

export const ChooseCourt = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const {
    branchId,
    venueName,
    branchLocation,
    bookingDetails,
    profilePhotoUrl,
  } = route.params;

  const [confirmedTime, setConfirmedTime] = useState<TimeSlot | undefined>(
    bookingDetails?.time
  );
  const [pressedCourt, setPressedCourt] = useState<Court | null>(null);
  const [timeSlotPickerVisible, setTimeSlotPickerVisible] =
    useState<boolean>(false);

  const date = new Date(JSON.parse(bookingDetails!.date));
  const searchDate = `${date.getFullYear()}-${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

  const { data: branches } = useSearchBranchesQuery({
    ...bookingDetails!,
    date: searchDate,
    branchId,
  });

  return (
    <AppHeader absolutePosition={false} title={"Choose a Court"} backEnabled>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text variant="labelLarge" style={styles.locationComponent}>
          {venueName}, {branchLocation}
        </Text>
        <TimeSlotPicker
          visible={timeSlotPickerVisible}
          setVisible={setTimeSlotPickerVisible}
          time={confirmedTime}
          availableTimes={pressedCourt?.timeSlots}
          occupiedTimes={pressedCourt?.occupiedTimes}
          onPress={(tempTime) => {
            setConfirmedTime(tempTime);
            if (bookingDetails)
              navigation.push("BookingPayment", {
                venueName: venueName!,
                courtName: pressedCourt!.name,
                courtType: pressedCourt!.courtType,
                courtRating: pressedCourt!.rating,
                courtMaxPlayers: pressedCourt!.nbOfPlayers,
                price: pressedCourt!.price,
                bookingDetails: {
                  ...bookingDetails,
                  time: tempTime,
                  courtId: pressedCourt!.id,
                },
                profilePhotoUrl,
              });
          }}
          constrained={"full"}
        />
        {branches &&
          branches.length > 0 &&
          branches[0]?.courts.map((court, index: number) => (
            <CourtCard
              key={index}
              venueName={venueName!}
              type={court.courtType}
              name={court.name}
              price={court.price}
              onPress={() => {
                setPressedCourt(court);
                setTimeSlotPickerVisible(true);
              }}
              rating={court.rating}
            />
          ))}
      </ScrollView>
    </AppHeader>
  );
};

const makeStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    locationComponent: {
      color: colors.tertiary,
      margin: 20,
    },
  });
