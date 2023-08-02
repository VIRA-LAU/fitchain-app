import { useQuery } from "react-query";
import { Court, GameType, TimeSlot } from "src/types";
import client from "../../client";

type Response = {
  timeSlot: TimeSlot;
  court: Court;
};

export type TimeSlotsResponse = {
  id?: number;
  startTime: Date;
  endTime: Date;
  gameType: GameType;
  courtId: number;
  courtName: string;
  adminName?: string;
};

const getTimeSlotsInBranch = (branchId?: number) => async () => {
  if (branchId)
    return await client
      .get(`timeslots/branch/${branchId}`)
      .then((res) => res?.data)
      .catch((e) => {
        console.error("timeSlots-in-branch-query", e.response.data);
        throw new Error(e);
      });
};

export const useTimeSlotsInBranchQuery = (branchId?: number) => {
  return useQuery<Response[], unknown, TimeSlotsResponse[] | TimeSlot[]>(
    ["timeSlots-in-branch", branchId],
    getTimeSlotsInBranch(branchId),
    {
      select: (data) => {
        data = data.map((d) => ({
          court: d.court,
          timeSlot: {
            ...d.timeSlot,
            startTime: new Date(d.timeSlot.startTime),
            endTime: new Date(d.timeSlot.endTime),
          },
        }));
        let sorted = data.sort((a, b) =>
          a.timeSlot.startTime.getTime() <= b.timeSlot.startTime.getTime()
            ? -1
            : 1
        );
        sorted = sorted.sort((a, b) =>
          a.timeSlot.endTime.getTime() <= b.timeSlot.endTime.getTime() ? -1 : 0
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
