import { useQuery } from "react-query";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";
import { Game } from "src/types";
import { useContext } from "react";

const getBookings =
  (userData: UserData, type?: "upcoming" | "previous") => async () => {
    const header = getHeader(userData);

    return await client
      .get(`/games/bookings${type ? `?type=${type}` : ""}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("bookings-query", e);
        throw new Error(e);
      });
  };

export const useBookingsQuery = ({
  type,
}: { type?: "upcoming" | "previous" } = {}) => {
  const { userData } = useContext(UserContext);
  return useQuery<Game[]>(["bookings", type], getBookings(userData!, type), {
    select: (bookings) =>
      bookings.map((booking) => ({ ...booking, date: new Date(booking.date) })),
  });
};
