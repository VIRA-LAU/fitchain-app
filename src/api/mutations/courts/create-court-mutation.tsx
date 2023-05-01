import client, { getHeader } from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext, VenueData } from "../../../utils/UserContext";
import { useContext } from "react";
import { Court, GameType } from "src/types";

type Request = {
  name: string;
  courtType: GameType;
  nbOfPlayers: number;
  price: number;
  timeSlots: number[];
};

const createCourt = (venueData: VenueData) => async (data: Request) => {
  const header = getHeader(venueData);
  return await client
    .post("/courts", data, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("create-court-mutation", e);
      throw new Error(e);
    });
};

export const useCreateCourtMutation = (completeCreate: Function) => {
  const { venueData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<Court, unknown, Request>({
    mutationFn: createCourt(venueData!),
    onSuccess: () => {
      queryClient.refetchQueries(["courts-in-branch", venueData?.branchId]);
      queryClient.refetchQueries(["timeSlots-in-branch", venueData?.branchId]);
      completeCreate();
    },
  });
};
