export interface User {
  access_token: string;
  firstName: string;
  lastName: string;
  email: string;
  userId: number;
}

export type GameType = "basketball" | "football" | "tennis";
export interface Booking {
  date: Date;
  duration: number;
  type: GameType;
  court: {
    branch: {
      location: string;
      venue: {
        name: string;
      };
    };
  };
  admin: User;
}

export interface Invitation {
  user?: {
    firstName: string;
    lastName: string;
  };
  friend?: {
    firstName: string;
    lastName: string;
  };
  game: Booking;
}

export interface VenueBranch {
  location: string;
  venue: Venue;
  rating: number;
}

export interface Activity {
  date: Date;
  gameType: GameType;
}
