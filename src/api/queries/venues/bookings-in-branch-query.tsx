import { useContext } from "react";
import { useQuery } from "react-query";
import { Game } from "src/types";
import { UserContext, VenueData } from "src/utils";
import client, { getHeader } from "../../client";

const getBookingsInBranch =
  (venueData: VenueData, id?: number, date?: string) => async () => {
    const header = getHeader(venueData);
    if (id && date)
      return await client
        .get(`/branches/bookings/${id}?date=${date}`, header)
        .then((res) => res.data)
        .catch((e) => {
          console.error("bookings-in-branch-query", e.response.data);
          throw new Error(e);
        });
  };

export const useBookingsInBranchQuery = (id?: number, date?: string) => {
  const { venueData } = useContext(UserContext);
  return useQuery<Game[]>(
    ["bookings-in-branch", id, date],
    getBookingsInBranch(venueData!, id, date)
  );
};
