import client from "../../client";
import { Dispatch, SetStateAction, useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/utils";
import { Branch } from "src/types";
import { storeData } from "src/utils/AsyncStorage";

type Request = {
  isVenue: boolean;
  venueId: number;
  location: string;
  latitude: number;
  longitude: number;
  managerEmail: string;
  managerFirstName: string;
  managerLastName: string;
  phoneNumber: string;
  password: string;
};

const createBranch = async (data: Request) => {
  return await client
    .post("/auth/signup", data)
    .then((res) => res.data)
    .catch((error) => {
      console.error("venue-signup-mutation", error);
      console.error(error.response?.data);
      throw error;
    });
};

export const useCreateBranchMutation = (
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>
) => {
  const { setVenueData, setIsVenue } = useContext(UserContext);
  return useMutation<
    Branch & {
      branchId: number;
      venueId: number;
      venueName: string;
      branchLocation: string;
      access_token: string;
    },
    unknown,
    Request
  >({
    mutationFn: createBranch,
    onSuccess: async (data) => {
      let fetchedInfo = {
        branchId: data.branchId,
        venueId: data.venueId,
        venueName: data.venueName,
        branchLocation: data.branchLocation,
        managerFirstName: data.managerFirstName,
        managerLastName: data.managerLastName,
        managerEmail: data.managerEmail,
        token: data.access_token,
      };
      setIsVenue(true);
      setVenueData(fetchedInfo);
      const keys = [
        "isVenue",
        "branchId",
        "venueId",
        "venueName",
        "branchLocation",
        "managerFirstName",
        "managerLastName",
        "managerEmail",
        "token",
      ];
      const values = [
        true,
        data.branchId,
        data.venueId,
        data.venueName,
        data.branchLocation,
        data.managerFirstName,
        data.managerLastName,
        data.managerEmail,
        data.access_token,
      ];
      storeData(keys, values);
      setSignedIn("venue");
    },
  });
};
