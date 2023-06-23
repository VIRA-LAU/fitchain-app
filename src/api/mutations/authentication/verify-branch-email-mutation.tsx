import client from "../../client";
import { Dispatch, SetStateAction, useContext } from "react";
import { useMutation } from "react-query";
import { UserContext } from "src/utils";
import { Branch } from "src/types";
import { storeData } from "src/utils/AsyncStorage";
import { AxiosError } from "axios";

type Request = {
  branchId: number;
  code: string;
};

const verifyBranchEmail = async (data: Request) => {
  return await client
    .patch("/auth/verifyEmail/branch", data)
    .then((res) => res.data)
    .catch((error) => {
      console.error("verify-branch-email-mutation", error.response?.data);
      throw error;
    });
};

export const useVerifyBranchEmailMutation = (
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
    AxiosError<{ message: string }>,
    Request
  >({
    mutationFn: verifyBranchEmail,
    onSuccess: async (data) => {
      let fetchedInfo = {
        branchId: data.branchId,
        venueId: data.venueId,
        venueName: data.venueName,
        branchLocation: data.branchLocation,
        managerFirstName: data.managerFirstName,
        managerLastName: data.managerLastName,
        email: data.email,
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
        "email",
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
        data.email,
        data.access_token,
      ];
      storeData(keys, values);
      setSignedIn("venue");
    },
  });
};
