import { useQuery, useQueryClient } from "react-query";
import queryBuilder from "src/api/queryBuilder";
import { GameType, Branch } from "src/types";
import client from "../../client";

type Props = {
  date: string;
  gameType: GameType;
  startTime?: string;
  endTime?: string;
  branchId?: number;
  nbOfPlayers?: number;
};

const searchBranches = (params: Props) => async () => {
  const endpoint = `/branches/search${queryBuilder(params)}`;
  return await client
    .get(endpoint)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("search-branches-query", e);
      throw e;
    });
};

export const useSearchBranchesQuery = (params: Props) => {
  return useQuery<Branch[]>(
    ["search-branches", params],
    searchBranches(params),
    {
      select: (branches) =>
        branches.map((branch) => ({
          ...branch,
          courts: branch.courts.map((court) => ({
            ...court,
            timeSlots: court.timeSlots.map((timeSlot) => ({
              ...timeSlot,
              startTime: new Date(timeSlot.startTime),
              endTime: new Date(timeSlot.endTime),
            })),
            occupiedTimes: court.occupiedTimes?.map((timeSlot) => ({
              ...timeSlot,
              startTime: new Date(timeSlot.startTime),
              endTime: new Date(timeSlot.endTime),
            })),
          })),
        })),
    }
  );
};
