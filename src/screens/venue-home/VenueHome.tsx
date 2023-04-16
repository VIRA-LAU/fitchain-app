import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { VenueBottomTabParamList } from "src/navigation";
import CalendarPicker from "react-native-calendar-picker";
import { VenueBooking } from "src/components";
import { useState } from "react";

type Props = BottomTabScreenProps<VenueBottomTabParamList>;

export const VenueHome = ({ navigation, route }: Props) => {
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text variant="titleLarge" style={{ color: colors.tertiary }}>
        Hi, Toni
      </Text>
      <Text variant="headlineLarge" style={styles.venueName}>
        Athletico Sports Club
      </Text>
      <Text style={styles.location}>Dbayeh, Lebanon</Text>
      <View style={styles.calendarView}>
        <Text style={[styles.myCalendar]}>My Calendar</Text>
        <CalendarPicker
          textStyle={{ color: "white" }}
          todayBackgroundColor={colors.primary}
          selectedDayStyle={{ backgroundColor: colors.primary }}
          initialDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date.toDate())}
          width={useWindowDimensions().width * 0.89}
        />
      </View>
      <VenueBooking type="available" />
      <VenueBooking type="confirmed" />
      <VenueBooking type="confirmed" />
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
  });
