import { useQuery } from "react-query";
import queryBuilder from "src/api/queryBuilder";
import { GameType, Branch } from "src/types";
import client from "../../client";

type Props = {
  date: string;
  gameType: GameType;
  startTime?: string;
  endTime?: string;
  venueId?: number;
  nbOfPlayers?: number;
};

const searchBranches = (params: Props) => async () => {
  const endpoint = `/branches/search${queryBuilder(params)}`;
  return await client
    .get(endpoint)
    .then((res) => res?.data)
    .catch((e) => {
      console.error("search-branches-query", e);
      throw new Error(e);
    });
};

export const useSearchBranchesQuery = (params: Props) => {
  return useQuery<Branch[]>(
    ["search-branches", params],
    searchBranches(params)
  );
};
