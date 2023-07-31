import client from "../../client";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../../utils/UserContext";
import { useContext } from "react";
import { Court, GameType, TimeSlot } from "src/types";

type Request = {
  courtId: number;
  name: string;
  courtType: GameType;
  nbOfPlayers: number;
  price: number;
  timeSlots: TimeSlot[];
};

const updateCourt = async (data: Request) => {
  return await client
    .patch(`/courts/${data.courtId}`, data)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("update-court-mutation", e);
      throw new Error(e);
    });
};

export const useUpdateCourtMutation = (resetFields: Function) => {
  const { branchData } = useContext(UserContext);
  const queryClient = useQueryClient();
  return useMutation<Court, unknown, Request>({
    mutationFn: updateCourt,
    onSuccess: () => {
      queryClient.refetchQueries(["courts-in-branch", branchData?.branchId]);
      queryClient.refetchQueries(["timeSlots-in-branch", branchData?.branchId]);
      resetFields();
    },
  });
};
