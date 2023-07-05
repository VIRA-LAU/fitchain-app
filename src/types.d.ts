export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  description: string;
  email: string;
  phoneNumber: number;
  description: string;
  profilePhotoUrl?: string;
  coverPhotoUrl?: string;
  gender: string;
  height: string;
  weight: string;
  age: string;
  nationality: string;
  position: string;
  rating: number;
  performance: number;
  teamPlayer: number;
  punctuality: number;
  fairplay: number;
}

export type GameType = "Basketball" | "Football" | "Tennis";

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  courtTimeSlots?: {
    court: {
      name: string;
      courtType: GameType;
    };
  }[];
}

export interface Game {
  id;
  date: Date;
  gameTimeSlots: {
    timeSlot: TimeSlot;
  }[];
  type: GameType;
  court: Court;
  winnerTeam: string;
  admin: User;
  createdAt: Date;
  homeScore: number;
  awayScore: number;
  isRecording: boolean;
}

export interface Invitation {
  id: number;
  user?: {
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
  };
  friend?: {
    firstName: string;
    lastName: string;
    profilePhotoUrl?: string;
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
  name: string;
  courtType: GameType;
  price: number;
  rating: number;
  nbOfPlayers: number;
  courtTimeSlots: {
    timeSlot: TimeSlot;
    timeSlotId: number;
  }[];
  branchId: number;
  branch: {
    location: string;
    latitude: number;
    longitude: number;
    venue: {
      name: string;
    };
  };
}

export interface Branch {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  venue: {
    id: number;
    name: string;
  };
  photoDirectoryUrl: string;
  coverPhotoUrl: string;
  courts: Court[];
  rating: number;
  managerFirstName: string;
  managerLastName: string;
  email: string;
  phoneNumber: number;
  hash: string;
}

export interface Venue {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  branches: Branch[];
  rating: number;
}

export interface Activity {
  gameId: number;
  date: Date;
  type: GameType;
  isWinner: boolean | "DRAW";
}

export interface GameUpdate {
  admin: {
    id: number;
    firstName: string;
    lastName: string;
    profilePhotoUrl: string;
  };
  createdAt: Date;
  winnerTeam: "HOME" | "AWAY";
  status: string;
  gameInvitation: [
    {
      createdAt: Date;
      status: "PENDING" | "APPROVED" | "REJECTED";
      user: {
        id: number;
        firstName: string;
        lastName: string;
        profilePhotoUrl: string;
      };
      friend: {
        id: number;
        firstName: string;
        lastName: string;
        profilePhotoUrl: string;
      };
    }
  ];
  gameRequests: [
    {
      id: number;
      createdAt: Date;
      status: "PENDING" | "APPROVED" | "REJECTED";
      user: {
        id: number;
        firstName: string;
        lastName: string;
        profilePhotoUrl: string;
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
  rating: number;
  profilePhotoUrl?: string;
  coverPhotoUrl?: string;
}

export interface PlayerStatus {
  hasRequestedtoJoin: false | "APPROVED" | "REJECTED" | "PENDING";
  hasBeenInvited: false | "APPROVED" | "REJECTED" | "PENDING";
  requestId: number | false;
  invitationId: number | false;
  isAdmin: boolean;
}
