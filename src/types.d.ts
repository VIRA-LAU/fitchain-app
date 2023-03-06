export interface User {
  access_token: string;
  firstName: string;
  lastName: string;
  description: string;
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

// Contained inside Venue
export interface Branch {
  id: number;
  location: string;
  venueId: number;
  photoDirectoryURL: string;
  rating: number;
  courts: {
    id: number;
    createdAt: string;
    courtType: string;
    nbOfPlayers: number;
    branchId: number;
    price: number;
  }[];
}

export interface Venue {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  managerFirstName: string;
  managerLastName: string;
  managerEmail: string;
  managerPhoneNumber: number;
  hash: string;
  branches: Branch[];
}

// Shown on Home
export interface VenueBranch {
  location: string;
  rating: number;
  venue: {
    id: number;
    name: string;
  };
  courts: {
    id: number;
    courtType: string;
    price: number;
  }[];
}

export interface Activity {
  date: Date;
  gameType: GameType;
}
