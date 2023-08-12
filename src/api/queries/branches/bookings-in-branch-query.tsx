import { useQuery } from "react-query";
import { Game } from "src/types";
import client from "../../client";

const getBookingsInBranch = (id?: number, date?: string) => async () => {
  if (id && date)
    return await client
      .get(`/branches/bookings/${id}?date=${date}`)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("bookings-in-branch-query", e.response.data);
        throw e;
      });
};

export const useBookingsInBranchQuery = (id?: number, date?: string) => {
  return useQuery<Game[]>(
    ["bookings-in-branch", id, date],
    getBookingsInBranch(id, date),
    {
      select: (bookings) =>
        bookings.map((booking) => ({
          ...booking,
          startTime: new Date(booking.startTime),
          endTime: new Date(booking.endTime),
        })),
    }
  );
};
