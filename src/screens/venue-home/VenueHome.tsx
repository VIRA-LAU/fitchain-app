import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { VenueBottomTabParamList } from "src/navigation";
import CalendarPicker from "react-native-calendar-picker";
import {
  SportSelection,
  SportTypeDropdown,
  VenueBooking,
  VenueBookingSkeleton,
} from "src/components";
import { useContext, useMemo, useState } from "react";
import { UserContext } from "src/utils";
import { useBookingsInVenueQuery, useTimeSlotsQuery } from "src/api";
import { GameType } from "src/types";

type Props = BottomTabScreenProps<VenueBottomTabParamList>;

export const VenueHome = ({ navigation, route }: Props & {}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { venueData, setVenueData } = useContext(UserContext);

  const [selectedDate, setSelectedDate] = useState<string>(
    `${new Date().getFullYear()}-${("0" + (new Date().getMonth() + 1)).slice(
      -2
    )}-${("0" + new Date().getDate()).slice(-2)}`
  );

  const [selectedSports, setSelectedSports] = useState<SportSelection>({
    Basketball: true,
    Football: true,
    Tennis: true,
  });

  const { data: bookings } = useBookingsInVenueQuery(
    venueData?.venueId,
    selectedDate
  );
  const { data: timeSlots, isLoading: timeSlotsLoading } = useTimeSlotsQuery(
    venueData?.venueId
  );

  const allSlots = useMemo(() => {
    const occupiedTimeSlots = timeSlots?.filter(
      (timeSlot) =>
        bookings?.findIndex(
          (booking) =>
            booking.gameTimeSlots.findIndex(
              (bookingTimeSlot) => bookingTimeSlot.timeSlot.id === timeSlot.id
            ) !== -1
        ) === -1
    );

    const mappedBookings = bookings?.map((booking) => ({
      startTime: booking.gameTimeSlots[0].timeSlot.startTime,
      endTime:
        booking.gameTimeSlots[booking.gameTimeSlots.length - 1].timeSlot
          .endTime,
      adminName: `${booking.admin.firstName} ${booking.admin.lastName}`,
      gameType: booking.type,
    }));

    let combinedArr: {
      startTime: string;
      endTime: string;
      gameType: GameType;
      adminName?: string;
    }[] = [];

    if (occupiedTimeSlots) combinedArr = combinedArr.concat(occupiedTimeSlots);
    if (mappedBookings) combinedArr = combinedArr.concat(mappedBookings);

    combinedArr = combinedArr.sort((a, b) =>
      a.startTime <= b.startTime ? -1 : 1
    );
    combinedArr = combinedArr.sort((a, b) => (a.endTime <= b.endTime ? -1 : 0));
    console.log(selectedSports, combinedArr);
    combinedArr = combinedArr.filter((slot) => selectedSports[slot.gameType]);
    return combinedArr;
  }, [
    JSON.stringify(bookings),
    JSON.stringify(timeSlots),
    JSON.stringify(selectedSports),
  ]);

  const filteredTimeSlots = useMemo(() => {
    return timeSlots?.filter((slot) => selectedSports[slot.gameType]);
  }, [JSON.stringify(timeSlots), JSON.stringify(selectedSports)]);

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text variant="titleLarge" style={{ color: colors.tertiary }}>
          Hi, {venueData?.managerFirstName}
        </Text>
        <SportTypeDropdown
          selectedSports={selectedSports}
          setSelectedSports={setSelectedSports}
          position={"right"}
        />
      </View>
      <Text variant="headlineLarge" style={styles.venueName}>
        {venueData?.venueName}
      </Text>
      <Text style={styles.location}>Location?</Text>
      <View style={styles.calendarView}>
        <Text style={[styles.myCalendar]}>My Calendar</Text>
        <CalendarPicker
          textStyle={{ color: "white" }}
          todayBackgroundColor={colors.primary}
          selectedDayStyle={{ backgroundColor: colors.primary }}
          initialDate={new Date()}
          onDateChange={(date) => {
            const parsedDate = date.toDate();
            setSelectedDate(
              `${parsedDate.getFullYear()}-${(
                "0" +
                (parsedDate.getMonth() + 1)
              ).slice(-2)}-${("0" + parsedDate.getDate()).slice(-2)}`
            );
          }}
          width={useWindowDimensions().width * 0.89}
        />
      </View>
      {timeSlotsLoading && <VenueBookingSkeleton />}
      {!timeSlotsLoading &&
        (allSlots.length === 0 ? filteredTimeSlots : allSlots)?.map(
          ({ startTime, endTime, adminName, gameType }, index) => (
            <VenueBooking
              key={index}
              type={adminName ? "confirmed" : "available"}
              startTime={startTime}
              endTime={endTime}
              adminName={adminName}
              gameType={gameType}
            />
          )
        )}
      {!timeSlotsLoading &&
        (!filteredTimeSlots || filteredTimeSlots.length === 0) && (
          <Text style={styles.placeholderText}>
            There are no assigned time slots.
          </Text>
        )}
    </ScrollView>
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
    venueName: {
      color: "white",
      marginTop: 15,
      marginBottom: 5,
      maxWidth: "60%",
    },
    location: {
      fontFamily: "Inter-SemiBold",
      color: colors.primary,
      fontSize: 16,
    },
    calendarView: {
      marginTop: 30,
      marginBottom: 20,
    },
    myCalendar: {
      fontFamily: "Inter-SemiBold",
      color: "white",
      fontSize: 16,
      marginBottom: 10,
      marginLeft: 10,
    },
    placeholderText: {
      height: 50,
      fontFamily: "Inter-Medium",
      color: colors.tertiary,
      textAlign: "center",
      textAlignVertical: "center",
    },
  });
