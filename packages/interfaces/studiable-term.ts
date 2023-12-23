import type { Prisma } from "@quenti/prisma/client";

import type { Distractor } from "./distractors";

export type FacingTerm = {
  id: string;
  word: string;
  definition: string;
  wordRichText: Prisma.JsonValue;
  definitionRichText: Prisma.JsonValue;
  assetUrl: string | null;
  rank: number;
  studySetId: string;
};

export type StudiableTerm = FacingTerm & {
  correctness: number;
  appearedInRound?: number | null;
  incorrectCount: number;
};

export type StudiableTermWithDistractors = StudiableTerm & {
  distractors: Distractor[];
};
