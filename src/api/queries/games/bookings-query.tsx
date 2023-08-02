import { useQuery } from "react-query";
import client from "../../client";
import { Game } from "src/types";

const getBookings = (type?: "upcoming" | "previous") => async () => {
  return await client
    .get(`/games/bookings${type ? `?type=${type}` : ""}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("bookings-query", e);
      throw new Error(e);
    });
};

export const useBookingsQuery = ({
  type,
}: { type?: "upcoming" | "previous" } = {}) => {
  return useQuery<Game[]>(["bookings", type], getBookings(type), {
    select: (bookings) =>
      bookings.map((booking) => ({
        ...booking,
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
      })),
  });
};
