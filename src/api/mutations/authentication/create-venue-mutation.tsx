import client from "../../client";
import { Dispatch, SetStateAction, useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/utils";
import { Venue } from "src/types";
import { storeData } from "src/utils/AsyncStorage";

type Request = {
  isVenue: boolean;
  managerEmail: string;
  managerFirstName: string;
  managerLastName: string;
  name: string;
  phoneNumber: string;
  password: string;
};

const createVenue = async (data: Request) => {
  return await client
    .post("/auth/signup", data)
    .then((res) => res.data)
    .catch((error) => {
      console.error("venue-signup-mutation", error);
      console.error(error.response?.data);
      throw error;
    });
};

export const useCreateVenueMutation = (
  setSignedIn: Dispatch<SetStateAction<"player" | "venue" | null>>
) => {
  const { setVenueData, setIsVenue } = useContext(UserContext);
  return useMutation<
    Venue & {
      venueId: number;
      access_token: string;
    },
    unknown,
    Request
  >({
    mutationFn: createVenue,
    onSuccess: async (data) => {
      let fetchedInfo = {
        venueId: data.venueId,
        venueName: data.name,
        managerFirstName: data.managerFirstName,
        managerLastName: data.managerLastName,
        managerEmail: data.managerEmail,
        token: data.access_token,
      };
      setIsVenue(true);
      setVenueData(fetchedInfo);
      const keys = [
        "isVenue",
        "venueId",
        "venueName",
        "managerFirstName",
        "managerLastName",
        "managerEmail",
        "token",
      ];
      const values = [
        true,
        data.venueId,
        data.name,
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
