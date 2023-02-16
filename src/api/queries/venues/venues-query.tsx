import { useQuery } from "react-query";
import client from "../../client";

const getVenues = () => async () => {
  return await client
    .get(`/`)
    .then((res) => res.data)
    .catch((e) => {
      console.error("get-venues-query", e);
      throw new Error(e);
    });
};

export const useVenuesQuery = () => useQuery(["Venues"], getVenues());
