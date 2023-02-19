import { useQuery } from "react-query";
import client from "../../client";

const getBookings = (userId: number) => async () => {
  return await client
    .get(`/games/bookings?userId=${userId}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error("bookings-query", e);
      throw new Error(e);
    });
};

export const useBookingsQuery = (userId: number) =>
  useQuery(["bookings", userId], getBookings(userId));
