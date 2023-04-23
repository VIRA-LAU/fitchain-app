import { useContext } from "react";
import { useQuery } from "react-query";
import { Game } from "src/types";
import { UserContext, VenueData } from "src/utils";
import client, { getHeader } from "../../client";

const getBookingsInVenue =
  (venueData: VenueData, id?: number, date?: string) => async () => {
    const header = getHeader(venueData);
    if (id && date)
      return await client
        .get(`/venues/bookings/${id}?date=${date}`, header)
        .then((res) => res.data)
        .catch((e) => {
          console.error("bookings-in-venue-query", e.response.data);
          throw new Error(e);
        });
  };

export const useBookingsInVenueQuery = (id?: number, date?: string) => {
  const { venueData } = useContext(UserContext);
  return useQuery<Game[]>(
    ["bookings-in-venue", id, date],
    getBookingsInVenue(venueData!, id, date)
  );
};
