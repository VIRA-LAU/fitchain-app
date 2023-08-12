import { useQuery } from "react-query";
import { Venue } from "src/types";
import client from "../../client";

const getVenueById = (id?: number) => async () => {
  return await client
    .get(`/venues/${id}`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("venue-by-id-query", e);
      throw e;
    });
};

export const useVenueByIdQuery = (id?: number) => {
  return useQuery<Venue>(["venue-by-id", id], getVenueById(id));
};
