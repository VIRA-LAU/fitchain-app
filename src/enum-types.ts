export enum GameType {
  Basketball = "Basketball",
  Football = "Football",
  Tennis = "Tennis",
}

export enum CourtType {
  FullCourt = "FullCourt",
  HalfCourt = "HalfCourt",
}

export enum GameStatus {
  PAYMENTPENDING = "PAYMENTPENDING",
  PAYMENTREJECTED = "PAYMENTREJECTED",
  UPCOMING = "UPCOMING",
  COMPLETE = "COMPLETE",
  CANCELLED = "CANCELLED",
  RESULTSPENDING = "RESULTSPENDING",
  RESULTSPROCESSED = "RESULTSPROCESSED",
}

export enum StatisticsGameStatus {
  PENDING = "PENDING",
  INPROGRESS = "INPROGRESS",
  COMPLETE = "COMPLETE",
}
