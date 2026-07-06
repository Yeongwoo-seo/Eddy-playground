export type EvidenceStatus =
  | "locked"
  | "new"
  | "reviewed"
  | "verified"
  | "connected"
  | "contradiction";

export type SuspectStatus =
  | "unknown"
  | "person_of_interest"
  | "high_risk"
  | "cleared"
  | "accused";

export type CaseStatus =
  | "locked"
  | "briefing"
  | "active"
  | "accusation_available"
  | "closed";

export interface GameFlags {
  case01Started: boolean;
  briefingComplete: boolean;

  minaInterview1Complete: boolean;
  leoInterview1Complete: boolean;
  adrianInterview1Complete: boolean;

  traceLensUnlocked: boolean;

  operaMissionUnlocked: boolean;
  operaMissionSolved: boolean;

  minaLieDiscovered: boolean;

  bridgeMissionUnlocked: boolean;
  bridgeMissionSolved: boolean;

  strapMatchSolved: boolean;
  routeSolved: boolean;

  elevenMinuteGapDiscovered: boolean;
  leoInterview2Complete: boolean;

  cachePuzzleUnlocked: boolean;
  cachePuzzleSolved: boolean;

  mkInstructionUnlocked: boolean;
  accusationUnlocked: boolean;
  case01Closed: boolean;
  mkSignal01Seen: boolean;
}

export const INITIAL_FLAGS: GameFlags = {
  case01Started: false,
  briefingComplete: false,

  minaInterview1Complete: false,
  leoInterview1Complete: false,
  adrianInterview1Complete: false,

  traceLensUnlocked: false,

  operaMissionUnlocked: false,
  operaMissionSolved: false,

  minaLieDiscovered: false,

  bridgeMissionUnlocked: false,
  bridgeMissionSolved: false,

  strapMatchSolved: false,
  routeSolved: false,

  elevenMinuteGapDiscovered: false,
  leoInterview2Complete: false,

  cachePuzzleUnlocked: false,
  cachePuzzleSolved: false,

  mkInstructionUnlocked: false,
  accusationUnlocked: false,
  case01Closed: false,
  mkSignal01Seen: false,
};

export interface TopStatusInfo {
  caseCode: string;
  mode: "ACTIVE" | "FIELD" | "ANALYSIS";
  newCount: number;
}
