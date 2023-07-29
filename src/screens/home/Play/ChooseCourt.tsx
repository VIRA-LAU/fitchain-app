import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { StackParamList } from "navigation";
import { AppHeader } from "src/components";
import { ScrollView } from "react-native-gesture-handler";
import { CourtCard, TimeSlotPicker } from "src/components";
import { useEffect, useState } from "react";
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

  const [confirmedTime, setConfirmedTime] = useState<number[] | undefined>(
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
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Choose a Court"}
      backEnabled
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text variant="labelLarge" style={styles.locationComponent}>
          {venueName}, {branchLocation}
        </Text>
        <TimeSlotPicker
          visible={timeSlotPickerVisible}
          setVisible={setTimeSlotPickerVisible}
          time={confirmedTime}
          setTime={setConfirmedTime}
          onPress={() => {
            // if (bookingDetails && selectedTimeSlots)
            //   navigation.push("BookingPayment", {
            //     venueName: venueName!,
            //     courtName: pressedCourt!.name,
            //     courtType: pressedCourt!.courtType,
            //     courtRating: pressedCourt!.rating,
            //     courtMaxPlayers: pressedCourt!.nbOfPlayers,
            //     selectedTimeSlots,
            //     price: pressedCourt!.price,
            //     bookingDetails: {
            //       ...bookingDetails,
            //       timeSlotIds: selectedTimeSlots.map((slot) => slot.id),
            //       startTime: selectedTimeSlots[0].startTime,
            //       endTime:
            //         selectedTimeSlots[selectedTimeSlots.length - 1].endTime,
            //       courtId: pressedCourt!.id,
            //     },
            //     profilePhotoUrl,
            //   });
          }}
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
