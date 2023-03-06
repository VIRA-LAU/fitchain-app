import { useQuery } from "react-query";
import { UserData } from "src/utils";
import client, { getHeader } from "../../client";
import { Booking } from "src/types";

const getBookings = (userData: UserData) => async () => {
  const header = getHeader(userData);

  return await client
    .get(`/games/bookings`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("bookings-query", e);
      throw new Error(e);
    });
};

export const useBookingsQuery = (userData: UserData) =>
  useQuery<Booking[]>(["bookings", userData?.userId], getBookings(userData), {
    select: (bookings) =>
      bookings
        .map((booking) => ({ ...booking, date: new Date(booking.date) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
  });
