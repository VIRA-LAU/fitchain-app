import { useQuery } from "react-query";
import { TimeSlot } from "src/types";
import client from "../../client";

const getTimeSlots = async () => {
  return await client
    .get("/timeslots")
    .then((res) => res?.data)
    .catch((e) => {
      console.error("timeSlots-query", e.response.data);
      throw e;
    });
};

export const useTimeSlotsQuery = () => {
  return useQuery<TimeSlot[]>("timeSlots", getTimeSlots, {
    select: (timeSlots) =>
      timeSlots.map((timeSlot) => ({
        ...timeSlot,
        startTime: new Date(timeSlot.startTime),
        endTime: new Date(timeSlot.endTime),
      })),
  });
};
