import { useContext } from "react";
import { useQuery } from "react-query";
import { GameType, VenueBranch } from "src/types";
import { UserContext, UserData } from "src/utils";
import client, { getHeader } from "../../client";

type Props = {
  date: string;
  gameType: GameType;
  startTime?: string;
  endTime?: string;
};

const queryBuilder = (params?: any) => {
  if (!params) return "";
  const keys = Object.keys(params);
  if (keys.length === 1) return `?${keys[0]}=${params[keys[0]]}`;
  else {
    let output = "?";
    Object.keys(params).forEach((key, index: number) => {
      if (params[key]) {
        output = output + key + "=" + params[key];
        if (index + 1 !== keys.length) output = output + "&";
      }
    });
    return output;
  }
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
  return useQuery<VenueBranch[]>(
    ["search-branches", params],
    searchBranches(userData!, params)
  );
};
