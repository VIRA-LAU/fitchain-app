import { useQuery } from "react-query";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";
import React from "react";
import { useContext } from "react";
import { Booking } from "src/types";

const getBookings = (userData: UserData) => async () => {
  // const { userData, setUserData } = useContext(UserContext) as any;
  let head = getHeader(userData);

  return await client
    .get(`/games/bookings`, head)
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
