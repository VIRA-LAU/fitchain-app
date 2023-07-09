import { useQuery } from "react-query";
import { TimeSlot } from "src/types";
import client from "../../client";

const getTimeSlots = async () => {
  return await client
    .get("/timeslots")
    .then((res) => res?.data)
    .catch((e) => {
      console.error("timeSlots-query", e.response.data);
      throw new Error(e);
    });
};

export const useTimeSlotsQuery = () => {
  return useQuery<TimeSlot[]>("timeSlots", getTimeSlots);
};
