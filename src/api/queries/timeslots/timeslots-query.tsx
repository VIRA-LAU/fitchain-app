import { useContext } from "react";
import { useQuery } from "react-query";
import { GameType, TimeSlot } from "src/types";
import { UserContext, VenueData } from "src/utils";
import client, { getHeader } from "../../client";

type Response = {
  id: number;
  startTime: string;
  endTime: string;
  gameType: GameType;
  adminName?: string;
}[];

const getTimeSlots = (venueData: VenueData, id?: number) => async () => {
  const header = getHeader(venueData);
  if (id)
    return await client
      .get(`/timeslots?branchId=${id}`, header)
      .then((res) => res.data)
      .catch((e) => {
        console.error("timeSlots-in-branch-query", e.response.data);
        throw new Error(e);
      });
};

export const useTimeSlotsQuery = (id?: number) => {
  const { venueData } = useContext(UserContext);
  return useQuery<TimeSlot[], unknown, Response>(
    ["timeSlots-in-branch", id],
    getTimeSlots(venueData!, id),
    {
      select: (data) => {
        let sorted = data.sort((a, b) => (a.startTime <= b.startTime ? -1 : 1));
        sorted = sorted.sort((a, b) => (a.endTime <= b.endTime ? -1 : 0));

        let separatedTimeSlots: Response = [];

        sorted?.forEach((timeSlot) => {
          timeSlot.courtTimeSlots?.forEach((courtTimeSlot) => {
            separatedTimeSlots.push({
              id: timeSlot.id,
              startTime: timeSlot.startTime,
              endTime: timeSlot.endTime,
              gameType: courtTimeSlot.court.courtType,
            });
          });
        });

        return separatedTimeSlots;
      },
    }
  );
};
