import React from "react";

export type UserData = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
};
export type ContextProps = {
  readonly userData: UserData | null;
  readonly setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export const UserContext = React.createContext<ContextProps>({
  userData: null,
  setUserData: () => {},
});
