import React from "react";

interface UserContextType {
  userId: number | null;
}

export const UserContext = React.createContext<UserContextType>({
  userId: null,
});
