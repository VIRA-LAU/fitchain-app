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
import { useSearchBranchesQuery } from "src/api";

type Props = StackScreenProps<HomeStackParamList, "ChooseCourt">;

export const ChooseCourt = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { branchId, venueName, branchLocation, bookingDetails } = route.params;

  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [pressedCourt, setPressedCourt] = useState<Court | null>(null);
  const [timeSlotVisible, setTimeSlotVisible] = useState<boolean>(false);

  const date = new Date(JSON.parse(bookingDetails!.date));
  const searchDate = `${date.getFullYear()}-${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

  const { data: branches, isLoading: branchesLoading } = useSearchBranchesQuery(
    {
      ...bookingDetails!,
      date: searchDate,
      branchId,
    }
  );

  useEffect(() => {
    selectedTimeSlots.sort((a, b) => {
      if (a.startTime < b.startTime) {
        return -1;
      }
      if (a.startTime < b.startTime) {
        return 1;
      }
      return 0;
    });
  }, [JSON.stringify(selectedTimeSlots)]);

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
          visible={timeSlotVisible}
          setVisible={setTimeSlotVisible}
          timeSlots={pressedCourt?.courtTimeSlots}
          selectedTimeSlots={selectedTimeSlots}
          setSelectedTimeSlots={setSelectedTimeSlots}
          onPress={() => {
            if (bookingDetails && selectedTimeSlots)
              navigation.push("VenueBookingDetails", {
                venueName: venueName!,
                courtName: pressedCourt!.name,
                courtType: pressedCourt!.courtType,
                courtRating: pressedCourt!.rating,
                courtMaxPlayers: pressedCourt!.nbOfPlayers,
                selectedTimeSlots,
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
