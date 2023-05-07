import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, VenueData } from "../../../utils/UserContext";
import { useContext } from "react";
import { Court, GameType } from "src/types";

type Request = {
  courtId: number;
  name: string;
  courtType: GameType;
  nbOfPlayers: number;
  price: number;
  timeSlots: number[];
};

const updateCourt = (venueData: VenueData) => async (data: Request) => {
  const header = getHeader(venueData);
  return await client
    .patch(`/courts/${data.courtId}`, data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("update-court-mutation", e);
      throw new Error(e);
    });
};

export const useUpdateCourtMutation = (resetFields: Function) => {
  const { venueData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<Court, unknown, Request>({
    mutationFn: updateCourt(venueData!),
    onSuccess: () => {
      queryClient.refetchQueries(["courts-in-branch", venueData?.branchId]);
      queryClient.refetchQueries(["timeSlots-in-branch", venueData?.branchId]);
      resetFields();
    },
  });
};
