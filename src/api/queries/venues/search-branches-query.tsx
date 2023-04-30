import { useContext } from "react";
import { useQuery } from "react-query";
import queryBuilder from "src/api/queryBuilder";
import { GameType, Branch } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

type Props = {
  date: string;
  gameType: GameType;
  startTime?: string;
  endTime?: string;
  venueId?: number;
  nbOfPlayers?: number;
};

const searchBranches = (userData: UserData, params: Props) => async () => {
  const header = getHeader(userData);
  const endpoint = `/branches/search${queryBuilder(params)}`;
  return await client
    .get(endpoint, header)
    .then((res) => res.data)
    .catch((e) => {
      console.error("search-branches-query", e);
      throw new Error(e);
    });
};

export const useSearchBranchesQuery = (params: Props) => {
  const { userData } = useContext(UserContext);
  return useQuery<Branch[]>(
    ["search-branches", params],
    searchBranches(userData!, params)
  );
};
