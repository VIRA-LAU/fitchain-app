import { useQuery } from "react-query";
import { Venue } from "src/types";
import client from "../../client";

const getVenues = async () => {
  return await client
    .get(`/venues`)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("get-venues-query", e);
      throw e;
    });
};

export const useVenuesQuery = () => useQuery<Venue[]>("venues", getVenues);
