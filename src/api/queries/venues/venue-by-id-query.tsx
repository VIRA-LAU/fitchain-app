import { useQuery } from "react-query";
import { Venue } from "src/types";
import { UserData } from "src/utils";
import client, { getHeader } from "../../client";

const getVenueById = (userData: UserData, id: number) => async () => {
  const header = getHeader(userData);
  return await client
    .get(`/venues/${id}`, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("get-venues-query", e);
      throw new Error(e);
    });
};

export const useVenueByIdQuery = (userData: UserData, id: number) =>
  useQuery<Venue>(["Venue", id], getVenueById(userData, id));
