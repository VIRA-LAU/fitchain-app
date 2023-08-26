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
  id?: number;
  startTime: Date | string;
  endTime: Date | string;
  courtId?: number;
  court?: Court;
}

export interface Game {
  id;
  startTime: Date;
  endTime: Date;
  type: GameType;
  court: Court;
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
  timeSlots: TimeSlot[];
  occupiedTimes?: TimeSlot[];
  branchId: number;
  branch: {
    location: string;
    latitude: number;
    longitude: number;
    profilePhotoUrl: string;
    venue: {
      name: string;
    };
  };
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

export interface Branch {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  venue: Venue;
  photoDirectoryUrl: string;
  profilePhotoUrl: string;
  coverPhotoUrl: string;
  branchPhotoUrl: string;
  courts: Court[];
  rating: number;
  managerFirstName: string;
  managerLastName: string;
  email: string;
  phoneNumber: number;
  hash: string;
}

export interface Activity {
  gameId: number;
  startTime: Date;
  endTime: Date;
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

export interface GameStats {
  [key: string]:
    | {
        playerPoints: {
          [key: string]: {
            scored: number;
            missed: number;
          };
        };
        points: number;
        possession: string;
      }
    | unknown
    | any;
}
