import { useContext } from "react";
import { useQuery } from "react-query";
import { Court, GameType, TimeSlot } from "src/types";
import { UserContext, VenueData } from "src/utils";
import client, { getHeader } from "../../client";

type Response = {
  timeSlot: TimeSlot;
  court: Court;
};

export type TimeSlotsResponse = {
  id?: number;
  startTime: string;
  endTime: string;
  gameType: GameType;
  courtId: number;
  courtName: string;
  adminName?: string;
};

const getTimeSlotsInBranch =
  (venueData: VenueData, branchId?: number) => async () => {
    const header = getHeader(venueData);
    if (branchId)
      return await client
        .get(`timeslots/branch/${branchId}`, header)
        .then((res) => res.data)
        .catch((e) => {
          console.error("timeSlots-in-branch-query", e.response.data);
          throw new Error(e);
        });
  };

export const useTimeSlotsInBranchQuery = (branchId?: number) => {
  const { venueData } = useContext(UserContext);
  return useQuery<Response[], unknown, TimeSlotsResponse[] | TimeSlot[]>(
    ["timeSlots-in-branch", branchId],
    getTimeSlotsInBranch(venueData!, branchId),
    {
      select: (data) => {
        let sorted = data.sort((a, b) =>
          a.timeSlot.startTime <= b.timeSlot.startTime ? -1 : 1
        );
        sorted = sorted.sort((a, b) =>
          a.timeSlot.endTime <= b.timeSlot.endTime ? -1 : 0
        );

        let separatedTimeSlots: TimeSlotsResponse[] = [];

        sorted?.forEach((courtTimeSlot) => {
          separatedTimeSlots.push({
            id: courtTimeSlot.timeSlot.id,
            startTime: courtTimeSlot.timeSlot.startTime,
            endTime: courtTimeSlot.timeSlot.endTime,
            gameType: courtTimeSlot.court.courtType,
            courtId: courtTimeSlot.court.id,
            courtName: courtTimeSlot.court.name,
          });
        });

        return separatedTimeSlots;
      },
    }
  );
};
