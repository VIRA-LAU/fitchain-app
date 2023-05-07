import { useContext } from "react";
import { useQuery } from "react-query";
import { Venue } from "src/types";
import { UserContext, UserData, VenueData } from "src/utils";
import client, { getHeader } from "../../client";

const getVenueById =
  (userData: UserData | VenueData, id?: number) => async () => {
    const header = getHeader(userData);
    return await client
      .get(`/venues/${id}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("venue-by-id-query", e);
        throw new Error(e);
      });
  };

export const useVenueByIdQuery = (id?: number) => {
  const { userData, venueData } = useContext(UserContext);
  return useQuery<Venue>(
    ["venue-by-id", id],
    getVenueById((userData || venueData)!, id)
  );
};
