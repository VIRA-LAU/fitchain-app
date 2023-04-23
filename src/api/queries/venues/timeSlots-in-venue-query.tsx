import { useContext } from "react";
import { useQuery } from "react-query";
import { TimeSlot } from "src/types";
import { UserContext, VenueData } from "src/utils";
import client, { getHeader } from "../../client";

const getTimeSlotsInVenue = (venueData: VenueData, id?: number) => async () => {
  const header = getHeader(venueData);
  if (id)
    return await client
      .get(`/venues/timeSlots/${id}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("timeSlots-in-venue-query", e);
        throw new Error(e);
      });
};

export const useTimeSlotsInVenueQuery = (id?: number) => {
  const { venueData } = useContext(UserContext);
  return useQuery<TimeSlot[], unknown, (TimeSlot & { adminName: string })[]>(
    ["timeSlots-in-venue", id],
    getTimeSlotsInVenue(venueData!, id),
    {
      select: (data) => {
        let sorted = data.sort((a, b) => (a.startTime <= b.startTime ? -1 : 1));
        sorted = sorted.sort((a, b) => (a.endTime <= b.endTime ? -1 : 0));
        return sorted.map((slot) => ({ ...slot, adminName: "" }));
      },
    }
  );
};
