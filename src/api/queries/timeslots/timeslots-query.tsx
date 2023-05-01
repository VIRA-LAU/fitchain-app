import { useContext } from "react";
import { useQuery } from "react-query";
import { TimeSlot } from "src/types";
import { UserContext, VenueData } from "src/utils";
import client, { getHeader } from "../../client";

const getTimeSlots = (venueData: VenueData) => async () => {
  const header = getHeader(venueData);
  return await client
    .get("/timeslots", header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("timeSlots-query", e.response.data);
      throw new Error(e);
    });
};

export const useTimeSlotsQuery = () => {
  const { venueData } = useContext(UserContext);
  return useQuery<TimeSlot[]>("timeSlots", getTimeSlots(venueData!));
};
