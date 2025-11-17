import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type {
  FacingTerm,
  Question,
  RoundSummary,
  StudiableTermWithDistractors,
  TermWithDistractors,
} from "@quenti/interfaces";
import { shuffleArray } from "@quenti/lib/array";
import { SPECIAL_CHAR_REGEXP } from "@quenti/lib/constants/characters";
import { LEARN_TERMS_IN_ROUND } from "@quenti/lib/constants/learn";
import { CORRECT, INCORRECT } from "@quenti/lib/constants/remarks";
import type { LearnMode, StudySetAnswerMode } from "@quenti/prisma/client";

import { word } from "../utils/terms";

export interface LearnStoreProps {
  mode: LearnMode;
  answerMode: StudySetAnswerMode;
  studiableTerms: StudiableTermWithDistractors[];
  allTerms: TermWithDistractors[];
  numTerms: number;
  termsThisRound: number;
  currentRound: number;
  roundProgress: number;
  roundCounter: number;
  roundTimeline: Question[];
  specialCharacters: string[];
  feedbackBank: { correct: string[]; incorrect: string[] };
  questionTypes: ("choice" | "write")[];
  answered?: string;
  status?: "correct" | "incorrect" | "unknownPartial";
  roundSummary?: RoundSummary;
  completed: boolean;
  hasMissedTerms?: boolean;
  prevTermWasIncorrect?: boolean;
  isRetyping?: boolean; // Track if user is retyping correct answer
  correctAnswerToRetype?: string; // The correct answer that needs to be retyped
  hintsUsed: Map<string, boolean>; // Track which terms had hints used
}

interface LearnState extends LearnStoreProps {
  initialize: (
    mode: LearnMode,
    answerMode: StudySetAnswerMode,
    questionTypes: ("choice" | "write")[],
    studiableTerms: StudiableTermWithDistractors[],
    allTerms: TermWithDistractors[],
    round: number,
  ) => void;
  answerCorrectly: (termId: string) => void;
  answerIncorrectly: (termId: string) => void;
  acknowledgeIncorrect: () => void;
  answerUnknownPartial: () => void;
  overrideCorrect: () => void;
  endQuestionCallback: () => void;
  correctFromUnknown: (termId: string) => void;
  incorrectFromUnknown: (termId: string) => void;
  nextRound: (start?: boolean) => void;
  setFeedbackBank: (correct: string[], incorrect: string[]) => void;
  setHintUsed: (termId: string, used: boolean) => void;
  startRetyping: (correctAnswer: string) => void;
  completeRetyping: () => void;
  updateTerm: (term: FacingTerm) => void;
}

export type LearnStore = ReturnType<typeof createLearnStore>;

export const createLearnStore = (initProps?: Partial<LearnStoreProps>) => {
  const DEFAULT_PROPS: LearnStoreProps = {
    mode: "Learn",
    answerMode: "Definition",
    studiableTerms: [],
    allTerms: [],
    numTerms: 0,
    termsThisRound: 0,
    currentRound: 0,
    roundProgress: 0,
    roundCounter: 0,
    roundTimeline: [],
    specialCharacters: [],
    feedbackBank: { correct: CORRECT, incorrect: INCORRECT },
    questionTypes: ["choice", "write"],
    completed: false,
    hintsUsed: new Map<string, boolean>(),
    isRetyping: false,
    correctAnswerToRetype: undefined,
  };

  return createStore<LearnState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      initialize: (
        mode,
        answerMode,
        questionTypes,
        studiableTerms,
        allTerms,
        round,
      ) => {
        const words =
          answerMode != "Both"
            ? studiableTerms.map((x) => word(answerMode, x, "answer"))
            : studiableTerms.map((x) => [x.word, x.definition]).flat();

        const specialCharacters = Array.from(
          new Set(
            words
              .map((word) =>
                [...word.matchAll(SPECIAL_CHAR_REGEXP)]
                  .map((x) => Array.from(x))
                  .flat(),
              )
              .flat()
              .map((x) => x.split(""))
              .flat(),
          ),
        );

        set({
          mode,
          answerMode,
          questionTypes,
          studiableTerms,
          allTerms,
          numTerms: studiableTerms.length,
          currentRound: round,
          specialCharacters,
        });

        set((state) => {
          state.nextRound(true);
          return {};
        });
      },
      answerCorrectly: (termId) => {
        set({
          answered: termId,
          status: "correct",
          prevTermWasIncorrect: false,
        });

        setTimeout(() => {
          set((state) => {
            const active = state.roundTimeline[state.roundCounter]!;
            const original = active.term.correctness;
            if (
              state.questionTypes.length === 1 &&
              (original === 0 || original === -1)
            ) {
              active.term.correctness = 2;
            } else if (active.type === "choice") {
              // For choice questions: -2 → -1 → 1
              if (original === -2) {
                active.term.correctness = -1;
              } else {
                active.term.correctness = 1;
              }
            } else {
              // For write questions: -1 → 2 (write questions don't use -2)
              active.term.correctness = 2;
            }

            state.endQuestionCallback();
            return {};
          });
        }, 1000);
      },
      answerIncorrectly: (termId) => {
        set((state) => {
          const active = state.roundTimeline[state.roundCounter];
          if (!active) return {};
          const shouldRepeat = active.term.correctness === -2;
          return {
            answered: termId,
            status: "incorrect",
            roundTimeline:
              shouldRepeat && state.roundProgress != state.termsThisRound - 1
                ? [...state.roundTimeline, active]
                : state.roundTimeline,
            prevTermWasIncorrect: true,
          };
        });
      },
      acknowledgeIncorrect: () => {
        set((state) => {
          const active = state.roundTimeline[state.roundCounter];
          if (!active) return {};
          const shouldRepeat = active.term.correctness === -2;
          const original = active.term.correctness;
          let newCorrectness = active.type === "choice" ? -2 : -1;
          if (state.questionTypes.length === 1 && original === 0) {
            newCorrectness = -1;
          }
          active.term.correctness = newCorrectness;
          active.term.incorrectCount++;

          // Reset retyping state if active
          if (state.isRetyping) {
            set({
              isRetyping: false,
              correctAnswerToRetype: undefined,
            });
          }

          if (!shouldRepeat) state.prevTermWasIncorrect = false;

          state.endQuestionCallback();
          return {};
        });
      },
      answerUnknownPartial: () => {
        set({ status: "unknownPartial" });
      },
      overrideCorrect: () => {
        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          active.term.correctness = 2;

          // Reset retyping state if active
          if (state.isRetyping) {
            set({
              isRetyping: false,
              correctAnswerToRetype: undefined,
            });
          }

          const roundTimeline = state.roundTimeline;
          if (
            state.roundProgress !== state.termsThisRound - 1 &&
            roundTimeline[roundTimeline.length - 1] === active
          ) {
            // Remove the added question from the timeline if a repeat was scheduled
            roundTimeline.splice(-1);
          }

          state.endQuestionCallback();
          return {
            roundTimeline,
            prevTermWasIncorrect: false,
          };
        });
      },
      endQuestionCallback: () => {
        set((state) => {
          if (state.roundCounter >= state.roundTimeline.length) {
            return {};
          }
          const masteredCount = state.studiableTerms.filter(
            (x) => x.correctness == 2,
          ).length;
          if (masteredCount == state.numTerms) {
            const hasMissedTerms = !!state.studiableTerms.find(
              (x) => x.incorrectCount > 0,
            );
            return { completed: true, hasMissedTerms, status: undefined };
          }

          if (state.roundCounter === state.roundTimeline.length - 1) {
            return {
              roundSummary: {
                round: state.currentRound,
                termsThisRound: Array.from(
                  new Set(state.roundTimeline.map((q) => q.term)),
                ),
                progress: state.studiableTerms.filter((x) => x.correctness == 2)
                  .length,
                totalTerms: state.numTerms,
              },
              status: undefined,
            };
          }

          const roundCounter = state.roundCounter + 1;
          const active = state.roundTimeline[state.roundCounter]!;
          const shouldRepeat = active.term.correctness === -2;
          const roundProgress = state.roundProgress + (shouldRepeat ? 0 : 1);

          return {
            roundCounter,
            roundProgress,
            answered: undefined,
            status: undefined,
          };
        });
      },
      correctFromUnknown: (termId) => {
        set({
          answered: termId,
          prevTermWasIncorrect: false,
        });

        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          if (active.type === "choice") {
            // For choice questions: -2 → -1 → 1
            if (active.term.correctness === -2) {
              active.term.correctness = -1;
            } else {
              active.term.correctness = 1;
            }
          } else {
            // For write questions: -1 → 2 (write questions don't use -2)
            active.term.correctness = 2;
          }

          state.endQuestionCallback();
          return {};
        });
      },
      incorrectFromUnknown: (termId) => {
        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          const shouldRepeat = active.term.correctness === -2;
          return {
            answered: termId,
            roundTimeline:
              shouldRepeat && state.roundProgress != state.termsThisRound - 1
                ? [...state.roundTimeline, active]
                : state.roundTimeline,
            prevTermWasIncorrect: true,
          };
        });

        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          const shouldRepeat = active.term.correctness === -2;
          const original = active.term.correctness;
          let newCorrectness = active.type === "choice" ? -2 : -1;
          if (state.questionTypes.length === 1 && original === 0) {
            newCorrectness = -1;
          }
          active.term.correctness = newCorrectness;
          active.term.incorrectCount++;

          if (!shouldRepeat) state.prevTermWasIncorrect = false;

          state.endQuestionCallback();
          return {};
        });
      },
      nextRound: (start = false) => {
        set((state) => {
          // Reset hints used for the new round
          const hintsUsed = new Map<string, boolean>();
          const currentRound = state.currentRound + (!start ? 1 : 0);

          const incorrectTerms = state.studiableTerms.filter(
            (x) => x.correctness == -1 || x.correctness == -2,
          );
          const unstudied = state.studiableTerms.filter(
            (x) => x.correctness == 0,
          );

          const familiarTerms = state.studiableTerms.filter(
            (x) => x.correctness == 1,
          );
          const familiarTermsWithRound = familiarTerms.map((x) => {
            if (x.appearedInRound === undefined)
              throw new Error("No round information for familiar term!");
            return x;
          });

          const termsThisRound = incorrectTerms
            .concat(
              // Add the familiar terms that haven't been seen at least 2 rounds ago
              familiarTermsWithRound.filter(
                (x) => currentRound - x.appearedInRound! >= 2,
              ),
            )
            .concat(unstudied)
            .concat(familiarTerms) // Add the rest of the familiar terms if there's nothing else left
            .slice(0, LEARN_TERMS_IN_ROUND);

          // For each term that hasn't been seen (correctness == 0), set the round it appeared in as the current round
          termsThisRound.forEach((x) => {
            if (x.correctness == 0) x.appearedInRound = currentRound;
          });

          const roundTimeline: Question[] = termsThisRound.map((term) => {
            let choice: boolean;
            if (
              state.questionTypes.includes("choice") &&
              state.questionTypes.includes("write")
            ) {
              choice = term.correctness < 1;
            } else {
              choice = state.questionTypes.includes("choice");
            }
            const answerMode: StudySetAnswerMode =
              state.answerMode != "Both"
                ? state.answerMode
                : Math.random() < 0.5
                  ? "Definition"
                  : "Word";

            if (choice) {
              const distractorIds = term.distractors
                .filter((x) => x.type == answerMode)
                .map((x) => x.distractingId);
              const distractors = state.allTerms.filter((x) =>
                distractorIds.includes(x.id),
              );

              const choices = shuffleArray(distractors.concat(term));

              return {
                answerMode,
                choices,
                term,
                type: "choice",
              };
            } else {
              return {
                answerMode,
                choices: [],
                term,
                type: "write",
              };
            }
          });

          const hasMissedTerms = !!state.studiableTerms.find(
            (x) => x.incorrectCount > 0,
          );

          return {
            roundSummary: undefined,
            termsThisRound: termsThisRound.length,
            roundTimeline,
            roundCounter: 0,
            roundProgress: 0,
            answered: undefined,
            status: undefined,
            completed: !termsThisRound.length,
            hasMissedTerms,
            currentRound,
            hintsUsed,
          };
        });
      },
      setFeedbackBank: (correct, incorrect) => {
        set({
          feedbackBank: { correct, incorrect },
        });
      },
      setHintUsed: (termId, used) => {
        set((state) => {
          const newHintsUsed = new Map(state.hintsUsed);
          newHintsUsed.set(termId, used);
          return { hintsUsed: newHintsUsed };
        });
      },
      startRetyping: (correctAnswer) => {
        set({
          isRetyping: true,
          correctAnswerToRetype: correctAnswer,
        });
      },
      completeRetyping: () => {
        set({
          isRetyping: false,
          correctAnswerToRetype: undefined,
        });
      },
      updateTerm: (term) => {
        set((state) => {
          const apply = <T extends FacingTerm>(t: T): T =>
            t.id === term.id ? { ...t, ...term } : t;

          return {
            studiableTerms: state.studiableTerms.map(apply),
            allTerms: state.allTerms.map(apply),
            roundTimeline: state.roundTimeline.map((q) => ({
              ...q,
              term: apply(q.term),
              choices: q.choices.map(apply),
            })),
          };
        });
      },
    })),
  );
};

export const LearnContext = React.createContext<LearnStore | null>(null);

export const useLearnContext = <T>(selector: (state: LearnState) => T): T => {
  const store = React.useContext(LearnContext);
  if (!store) throw new Error("Missing LearnContext.Provider in the tree");

  return useStore(store, selector);
};
