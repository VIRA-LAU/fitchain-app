import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const todayStr = new Date().toISOString();
const today = todayStr.substring(0, todayStr.indexOf("T"));

const dateIndices = Array.from({ length: 17 }, (_, i) => i - 8);
const centerIndex = 8;

const focusedWidth = 130;
const nonFocusedWidth = 42;

export const DatePicker = ({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
}) => {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState<number>(centerIndex);
  const [toUpdate, setToUpdate] = useState<"up" | "down" | null>(null);

  const dates = dateIndices.map((dateIndex) => {
    const tempDate = new Date(currentDate);
    tempDate.setDate(tempDate.getDate() + dateIndex);
    return tempDate;
  });

  const displayedDates = dates.map((date, index) => {
    if (date.toISOString() === currentDate?.toISOString())
      return `${
        today ===
        date.toISOString().substring(0, date.toISOString().indexOf("T"))
          ? "Today, "
          : ""
      }${date.getDate()} ${months[date.getMonth()]}`;
    else return date.getDate().toString();
  });

  const scrollCenter = {
    x: 8 * nonFocusedWidth + 10 + focusedWidth / 2 - (windowWidth - 2 * 24) / 2,
    y: 0,
  };

  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (toUpdate === "up") setCurrentIndex((oldIndex) => oldIndex + 1);
    else if (toUpdate === "down") setCurrentIndex((oldIndex) => oldIndex - 1);
  }, [toUpdate]);

  useEffect(() => {
    if (currentIndex !== centerIndex && toUpdate) {
      setCurrentDate(dates[currentIndex]);
      setCurrentIndex(centerIndex);
    }
  }, [currentIndex]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ ...scrollCenter, animated: false });
    setTimeout(() => {
      setToUpdate(null);
    }, 50);
  }, [currentDate?.toISOString()]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      contentOffset={scrollCenter}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={1}
      contentContainerStyle={{ paddingBottom: 16, paddingTop: 24 }}
      onScroll={
        toUpdate
          ? undefined
          : (event) => {
              let offset = event.nativeEvent.contentOffset.x;
              if (offset < scrollCenter.x - focusedWidth / 7 && !toUpdate) {
                setToUpdate("down");
              } else if (
                offset > scrollCenter.x + focusedWidth / 7 &&
                !toUpdate
              ) {
                setToUpdate("up");
              }
            }
      }
    >
      {displayedDates.map((date, index) => (
        <View
          key={index}
          style={{
            marginHorizontal:
              dates[index]?.toISOString() === currentDate?.toISOString()
                ? 10
                : 0,
            paddingVertical: 6,
            borderRadius: 16,
            width:
              dates[index]?.toISOString() === currentDate?.toISOString()
                ? focusedWidth
                : nonFocusedWidth,
            backgroundColor:
              dates[index]?.toISOString() === currentDate?.toISOString()
                ? colors.primary
                : "transparent",
          }}
        >
          <Text
            style={{
              color:
                dates[index]?.toISOString() === currentDate?.toISOString()
                  ? colors.background
                  : "#979797",
              fontFamily:
                dates[index]?.toISOString() === currentDate?.toISOString()
                  ? "Poppins-Medium"
                  : "Poppins-Regular",
              textAlign: "center",
            }}
          >
            {date}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};
