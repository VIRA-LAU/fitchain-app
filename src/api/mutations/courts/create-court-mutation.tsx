import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";
import { useContext } from "react";
import { Court, TimeSlot } from "src/types";
import { GameType } from "src/enum-types";

type Request = {
  name: string;
  courtType: GameType;
  nbOfPlayers: number;
  price: number;
  timeSlots: TimeSlot[];
};

const createCourt = async (data: Request) => {
  return await client
    .post("/courts", data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("create-court-mutation", e);
      throw e;
    });
};

export const useCreateCourtMutation = (completeCreate: Function) => {
  const { branchData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<Court, unknown, Request>({
    mutationFn: createCourt,
    onSuccess: () => {
      queryClient.refetchQueries(["courts-in-branch", branchData?.branchId]);
      queryClient.refetchQueries(["timeSlots-in-branch", branchData?.branchId]);
      completeCreate();
    },
  });
};
