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

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

export interface Game {
  id;
  date: Date;
  gameTimeSlots: {
    timeSlot: TimeSlot;
  }[];
  type: GameType;
  court: {
    branch: {
      location: string;
      venue: {
        name: string;
      };
    };
  };
  winnerTeam: string;
  admin: User;
  createdAt: Date;
  homeScore: number;
  awayScore: number;
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
  status: "PENDING" | "APPROVED" | "REJECTED";
  user: User;
  game: Game;
}

export interface Court {
  id: number;
  courtType: string;
  price: number;
  rating: number;
  branchId;
  courtTimeSlots: {
    timeSlot: TimeSlot;
  }[];
}

// Contained inside Venue
export interface Branch {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  venueId: number;
  photoDirectoryURL: string;
  courts: Court[];
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
  venue: {
    id: number;
    name: string;
  };
  courts: Court[];
}

export interface Activity {
  gameId: number;
  date: Date;
  type: GameType;
  isWinner: boolean;
}

export interface GameUpdate {
  admin: {
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  winnerTeam: "HOME" | "AWAY";
  status: string;
  gameInvitation: [
    {
      createdAt: Date;
      status: "PENDING" | "APPROVED" | "REJECTED";
      user: {
        firstName: string;
        lastName: string;
      };
      friend: {
        firstName: string;
        lastName: string;
      };
    }
  ];
  gameRequests: [
    {
      id: number;
      createdAt: Date;
      status: "PENDING" | "APPROVED" | "REJECTED";
      user: {
        firstName: string;
        lastName: string;
      };
    }
  ];
}

export interface TeamPlayer {
  id: number;
  team: "HOME" | "AWAY";
  status: "PENDING" | "APPROVED" | "REJECTED";
  firstName: string;
  lastName: string;
  rated: boolean;
}

export interface PlayerStatus {
  hasRequestedtoJoin: false | "APPROVED" | "REJECTED" | "PENDING";
  hasBeenInvited: false | "APPROVED" | "REJECTED" | "PENDING";
  requestId: number | false;
  invitationId: number | false;
  isAdmin: boolean;
}
