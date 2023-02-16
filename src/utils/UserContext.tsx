import React from "react";

interface UserContextType {
  token?: string | null;
  userId: number | null;
  firstName?: string | null;
  lastName?: string | null;
  setAuthentication?: Function;
  signIn?: Function;
  signOut?: Function;
}

export const UserContext = React.createContext<UserContextType>({
  token: null,
  userId: null,
  firstName: null,
  lastName: null,
  setAuthentication: () => {},
  signIn: () => {},
  signOut: () => {},
});
