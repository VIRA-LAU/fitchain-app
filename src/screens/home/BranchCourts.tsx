import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { HomeStackParamList } from "navigation";
import { AppHeader } from "src/components";
import { ScrollView } from "react-native-gesture-handler";
import { CourtCard, TimeSlotPicker } from "src/components";
import { useEffect, useState } from "react";
import { Court, TimeSlot } from "src/types";

type Props = StackScreenProps<HomeStackParamList, "BranchCourts">;

export const BranchCourts = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { courts, venueName, branchLocation, bookingDetails } = route.params;

  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [pressedCourt, setPressedCourt] = useState<Court | null>(null);
  const [timeSlotVisible, setTimeSlotVisible] = useState<boolean>(false);

  return (
    <AppHeader
      absolutePosition={false}
      navigation={navigation}
      route={route}
      title={"Select Court"}
      backEnabled
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text variant="labelLarge" style={styles.locationComponent}>
          {venueName}, {branchLocation}
        </Text>
        <TimeSlotPicker
          visible={timeSlotVisible}
          setVisible={setTimeSlotVisible}
          timeSlots={pressedCourt?.courtTimeSlots}
          selectedTimeSlots={selectedTimeSlots}
          setSelectedTimeSlots={setSelectedTimeSlots}
          onPress={() => {
            if (bookingDetails && selectedTimeSlots)
              navigation.push("VenueBookingDetails", {
                venueName: venueName,
                courtType: pressedCourt!.courtType,
                price: pressedCourt!.price,
                bookingDetails: {
                  ...bookingDetails,
                  timeSlotIds: selectedTimeSlots.map((slot) => slot.id),
                  startTime: selectedTimeSlots[0].startTime,
                  endTime:
                    selectedTimeSlots[selectedTimeSlots.length - 1].endTime,
                  courtId: pressedCourt!.id,
                },
              });
          }}
        />
        {courts.map((court, index: number) => (
          <CourtCard
            key={index}
            id={court.id}
            venueName={venueName}
            type={court.courtType}
            price={court.price}
            onPress={() => {
              setPressedCourt(court);
              setTimeSlotVisible(true);
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
