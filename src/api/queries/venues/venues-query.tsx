import { useQuery } from "react-query";
import { Venue } from "src/types";
import { UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getVenues = (userData: UserData) => async () => {
  const header = getHeader(userData);
  return await client
    .get(`/venues`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("get-venues-query", e);
      throw new Error(e);
    });
};

export const useVenuesQuery = (userData: UserData) =>
  useQuery<Venue[]>("venues", getVenues(userData));
