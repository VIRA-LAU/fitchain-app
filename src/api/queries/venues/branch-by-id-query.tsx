import { Dispatch, SetStateAction, useContext } from "react";
import { useQuery } from "react-query";
import { Branch } from "src/types";
import { UserContext, UserData, VenueData } from "src/utils";
import client, { getHeader } from "../../client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getBranchById =
  (userData: UserData | VenueData, id?: number) => async () => {
    const header = getHeader(userData);
    return await client
      .get(`/branches/${id}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("branch-by-id-query", e);
        throw new Error(e);
      });
  };

export const useBranchByIdQuery = (
  id?: number,
  enabled = true,
  setSignedIn?: Dispatch<SetStateAction<"player" | "venue" | null>>,
  setTokenFoundOnOpen?: Dispatch<SetStateAction<boolean>>
) => {
  const { userData, venueData } = useContext(UserContext);
  return useQuery<Branch>(
    ["branch-by-id", id],
    getBranchById((userData || venueData)!, id),
    {
      enabled,
      onSuccess: (data) => {
        if (setSignedIn) setSignedIn("venue");
        if (setTokenFoundOnOpen) setTokenFoundOnOpen(false);
      },
      onError: () => {
        if (setSignedIn) {
          AsyncStorage.clear();
          setSignedIn(null);
        }
        if (setTokenFoundOnOpen) setTokenFoundOnOpen(false);
      },
      retry: 1,
    }
  );
};
