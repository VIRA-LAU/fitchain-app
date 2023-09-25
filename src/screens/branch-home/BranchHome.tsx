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
  BranchBooking,
  BranchBookingSkeleton,
} from "src/components";
import { useContext, useState } from "react";
import { UserContext } from "src/utils";
import { useBookingsInBranchQuery } from "src/api";

type Props = BottomTabScreenProps<VenueBottomTabParamList>;

export const BranchHome = ({ navigation, route }: Props & {}) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const { branchData } = useContext(UserContext);

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

  const { data: bookingsInBranch, isLoading: bookingsLoading } =
    useBookingsInBranchQuery(branchData?.branchId, selectedDate);

  var mappedBookings = bookingsInBranch?.map((booking) => ({
    startTime: booking.startTime,
    endTime: booking.endTime,
    adminName: `${booking.admin.firstName} ${booking.admin.lastName}`,
    gameType: booking.type,
    courtId: booking.court.id,
    courtName: booking.court.name,
  }));

  mappedBookings = mappedBookings?.filter(
    (slot) => selectedSports[slot.gameType]
  );
  mappedBookings = mappedBookings?.sort((a, b) =>
    a.startTime <= b.startTime ? -1 : 1
  );
  mappedBookings = mappedBookings?.sort((a, b) =>
    a.endTime <= b.endTime ? -1 : 0
  );

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Text variant="titleLarge" style={{ color: colors.tertiary }}>
          Hi, {branchData?.managerFirstName}
        </Text>
        <SportTypeDropdown
          selectedSports={selectedSports}
          setSelectedSports={setSelectedSports}
          position={"right"}
        />
      </View>
      <Text variant="headlineLarge" style={styles.venueName}>
        {branchData?.venueName}
      </Text>
      <Text style={styles.location}>{branchData?.branchLocation}</Text>
      <View style={styles.calendarView}>
        <Text style={[styles.myCalendar]}>My Calendar</Text>
        <CalendarPicker
          textStyle={{ color: colors.tertiary }}
          todayBackgroundColor={colors.tertiary}
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
      {bookingsLoading && <BranchBookingSkeleton />}
      {!bookingsLoading &&
        mappedBookings?.map(
          ({ startTime, endTime, adminName, gameType, courtName }, index) => (
            <BranchBooking
              key={index}
              type={adminName ? "confirmed" : "available"}
              startTime={startTime}
              endTime={endTime}
              adminName={adminName}
              gameType={gameType}
              courtName={courtName}
            />
          )
        )}
      {!bookingsLoading && (!mappedBookings || mappedBookings.length === 0) && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            There are no bookings during this day.
          </Text>
        </View>
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
      color: colors.tertiary,
      marginTop: 15,
      marginBottom: 5,
      maxWidth: "60%",
    },
    location: {
      fontFamily: "Poppins-Bold",
      color: colors.primary,
      fontSize: 16,
    },
    calendarView: {
      marginTop: 30,
      marginBottom: 20,
    },
    myCalendar: {
      fontFamily: "Poppins-Bold",
      color: colors.tertiary,
      fontSize: 16,
      marginBottom: 10,
      marginLeft: 10,
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
  });
