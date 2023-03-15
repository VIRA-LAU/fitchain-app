export interface User {
  id?: number;
  userId?: number;
  access_token: string;
  firstName: string;
  lastName: string;
  description: string;
  email: string;
  phoneNumber: number;
  description: string;
  gender: string;
  height: string;
  weight: string;
  age: string;
  nationality: string;
  position: string;
  rating: number;
}

export type GameType = "Basketball" | "Football" | "Tennis";

export interface Game {
  id;
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
  createdAt: Date;
}

export interface Invitation {
  id: number;
  user?: {
    firstName: string;
    lastName: string;
  };
  friend?: {
    firstName: string;
    lastName: string;
  };
  game: Game;
}

export interface GameRequest {
  id: number;
  team: string;
  status: "PENDING" | "APPROVED" | "REJECED";
  user: User;
  game: Game;
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

// Shown in Home page
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
  gameId: number;
  date: Date;
  type: GameType;
  isWinner: boolean;
}

export interface TeamPlayer {
  id: number;
  team: "HOME" | "AWAY";
  status: "PENDING" | "APPROVED" | "REJECTED";
  firstName: string;
  lastName: string;
}

export interface PlayerStatus {
  hasRequestedtoJoin: false | "APPROVED" | "REJECTED" | "PENDING";
  hasBeenInvited: false | "ACCEPTED" | "REJECTED" | "PENDING";
  isAdmin: false;
}
