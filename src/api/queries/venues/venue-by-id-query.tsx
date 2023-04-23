import { Dispatch, SetStateAction, useContext } from "react";
import { useQuery } from "react-query";
import { Venue } from "src/types";
import { UserContext, UserData, VenueData } from "src/utils";
import client, { getHeader } from "../../client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getVenueById =
  (userData: UserData | VenueData, id?: number) => async () => {
    const header = getHeader(userData);
    return await client
      .get(`/venues/${id}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("get-venues-query", e);
        throw new Error(e);
      });
  };

export const useVenueByIdQuery = (
  id?: number,
  enabled = true,
  setSignedIn?: Dispatch<SetStateAction<"player" | "venue" | null>>,
  setTokenFoundOnOpen?: Dispatch<SetStateAction<boolean>>
) => {
  const { userData, venueData } = useContext(UserContext);
  return useQuery<Venue>(
    ["venue", id],
    getVenueById((userData || venueData)!, id),
    {
      enabled,
      onSuccess: (data) => {
        if (setSignedIn) setSignedIn("venue");
      },
      onError: () => {
        if (setSignedIn) {
          AsyncStorage.clear();
          setSignedIn(null);
        }
        if (setTokenFoundOnOpen) setTokenFoundOnOpen(false);
      },
    }
  );
};
