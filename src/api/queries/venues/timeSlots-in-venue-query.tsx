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
  return useQuery<TimeSlot[]>(
    ["timeSlots-in-venue", id],
    getTimeSlotsInVenue(venueData!, id)
  );
};
