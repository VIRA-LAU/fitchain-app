import { useContext } from "react";
import { useQuery } from "react-query";
import { GameType, TimeSlot } from "src/types";
import { UserContext, VenueData } from "src/utils";
import client, { getHeader } from "../../client";

export type TimeSlotsResponse = {
  id?: number;
  startTime: string;
  endTime: string;
  gameType: GameType;
  courtName: string;
  adminName?: string;
};

const getTimeSlots = (venueData: VenueData, branchId?: number) => async () => {
  const header = getHeader(venueData);
  const url = branchId ? `/timeslots?branchId=${branchId}` : "/timeslots";
  return await client
    .get(url, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("timeSlots-query", e.response.data);
      throw new Error(e);
    });
};

export const useTimeSlotsQuery = (branchId?: number) => {
  const { venueData } = useContext(UserContext);
  return useQuery<TimeSlot[], unknown, TimeSlotsResponse[] | TimeSlot[]>(
    ["timeSlots", branchId],
    getTimeSlots(venueData!, branchId),
    {
      select: (data) => {
        if (!branchId) return data;
        let sorted = data.sort((a, b) => (a.startTime <= b.startTime ? -1 : 1));
        sorted = sorted.sort((a, b) => (a.endTime <= b.endTime ? -1 : 0));

        let separatedTimeSlots: TimeSlotsResponse[] = [];

        sorted?.forEach((timeSlot) => {
          timeSlot.courtTimeSlots?.forEach((courtTimeSlot) => {
            separatedTimeSlots.push({
              id: timeSlot.id,
              startTime: timeSlot.startTime,
              endTime: timeSlot.endTime,
              gameType: courtTimeSlot.court.courtType,
              courtName: courtTimeSlot.court.name,
            });
          });
        });

        return separatedTimeSlots;
      },
    }
  );
};
